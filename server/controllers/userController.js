const User = require("../models/User");
const Branch = require("../models/Branch");
const { getCompanyFilter } = require("../middleware/authMiddleware");

// Expanded RBAC. super-admin is reserved (assigned only via DB/script).
const ALLOWED_ROLES = ["admin", "branch-manager", "cashier", "storekeeper", "sales"];

const sanitizeBranches = async (companyId, branchIds, role) => {
  const ids = Array.from(new Set((branchIds || []).map(String)));
  if (ids.length === 0) return [];
  const scope = role === "super-admin" ? {} : { company: companyId };
  const found = await Branch.find({ _id: { $in: ids }, ...scope }).select("_id");
  return found.map((b) => b._id);
};

// POST /api/users  (admin) — create a user inside the admin's company.
// Body: { name, email, password, role, branchIds: [], activeBranchId, branch? (legacy single id) }
exports.createUser = async (req, res) => {
  try {
    if (!req.user.companyId) {
      return res.status(400).json({ message: "Register a company before adding users" });
    }
    const { name, email, password, role, branchIds, activeBranchId, branch } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const safeRole = ALLOWED_ROLES.includes(role) ? role : "cashier";

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    // Accept either branchIds[] or single legacy branch.
    const requestedBranches = branchIds && branchIds.length ? branchIds : branch ? [branch] : [];
    let branches = await sanitizeBranches(req.user.companyId, requestedBranches, req.user.role);

    // Fallback to creator's active branch if nothing valid was supplied.
    if (branches.length === 0 && req.user.branchId) branches = [req.user.branchId];
    if (branches.length === 0) {
      return res.status(400).json({ message: "Assign at least one branch" });
    }

    const active =
      activeBranchId && branches.find((b) => String(b) === String(activeBranchId))
        ? activeBranchId
        : branches[0];

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      company: req.user.companyId,
      branches,
      activeBranch: active,
      branch: active, // legacy mirror
    });
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find(getCompanyFilter(req))
      .populate("branches", "name isMainBranch isActive")
      .populate("activeBranch", "name isMainBranch")
      .populate("branch", "name isMainBranch")
      .sort({ createdAt: -1 });
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, ...getCompanyFilter(req) })
      .populate("branches", "name isMainBranch isActive")
      .populate("activeBranch", "name isMainBranch");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ message: "Invalid user id" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, branchIds, activeBranchId, branch, isActive } = req.body || {};
    const target = await User.findOne({ _id: req.params.id, ...getCompanyFilter(req) });
    if (!target) return res.status(404).json({ message: "User not found" });

    if (name) target.name = name;
    if (email) target.email = email.toLowerCase();
    if (role && ALLOWED_ROLES.includes(role)) target.role = role;
    if (isActive !== undefined) target.isActive = isActive;

    if (branchIds) {
      const sanitized = await sanitizeBranches(req.user.companyId, branchIds, req.user.role);
      target.branches = sanitized;
      if (sanitized.length && !sanitized.find((b) => String(b) === String(target.activeBranch))) {
        target.activeBranch = sanitized[0];
        target.branch = sanitized[0];
      }
    }

    if (activeBranchId) {
      const ok = (target.branches || []).find((b) => String(b) === String(activeBranchId));
      if (!ok) return res.status(400).json({ message: "Active branch must be in the user's branches" });
      target.activeBranch = activeBranchId;
      target.branch = activeBranchId;
    } else if (branch) {
      // legacy single-branch field
      const b = await Branch.findOne({
        _id: branch,
        ...(req.user.role === "super-admin" ? {} : { company: req.user.companyId }),
      });
      if (!b) return res.status(400).json({ message: "Invalid branch" });
      if (!target.branches.find((x) => String(x) === String(b._id))) target.branches.push(b._id);
      target.activeBranch = b._id;
      target.branch = b._id;
    }

    await target.save();
    return res.json({ user: target });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user && req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }
    const user = await User.findOneAndDelete({ _id: req.params.id, ...getCompanyFilter(req) });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted", id: req.params.id });
  } catch (err) {
    return res.status(400).json({ message: "Invalid user id" });
  }
};
