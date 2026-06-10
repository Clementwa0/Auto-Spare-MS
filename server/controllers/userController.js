const User = require("../models/User");
const Branch = require("../models/Branch");
const { getCompanyFilter } = require("../middleware/authMiddleware");

const ALLOWED_ROLES = ["admin", "sales"];

// POST /api/users  (admin) — create a user inside the admin's company.
// Optional body.branch (must belong to admin's company); defaults to admin's branch.
exports.createUser = async (req, res) => {
  try {
    if (!req.user.companyId) {
      return res.status(400).json({ message: "Register a company before adding users" });
    }
    const { name, email, password, role, branch } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const safeRole = ALLOWED_ROLES.includes(role) ? role : "sales";

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    // Validate branch belongs to this company.
    let targetBranch = req.user.branchId;
    if (branch) {
      const b = await Branch.findOne({ _id: branch, company: req.user.companyId });
      if (!b) return res.status(400).json({ message: "Invalid branch for your company" });
      targetBranch = b._id;
    }
    if (!targetBranch) {
      return res.status(400).json({ message: "Create a branch before adding users" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      company: req.user.companyId,
      branch: targetBranch,
    });
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/users — users in the same company.
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find(getCompanyFilter(req))
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
      .populate("branch", "name isMainBranch");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ message: "Invalid user id" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, branch, isActive } = req.body || {};
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (role && ALLOWED_ROLES.includes(role)) update.role = role;
    if (isActive !== undefined) update.isActive = isActive;

    if (branch) {
      const b = await Branch.findOne({
        _id: branch,
        ...(req.user.role === "super-admin" ? {} : { company: req.user.companyId }),
      });
      if (!b) return res.status(400).json({ message: "Invalid branch" });
      update.branch = b._id;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, ...getCompanyFilter(req) },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
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
