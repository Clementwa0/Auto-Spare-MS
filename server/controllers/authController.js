const User = require("../models/User");
const Company = require("../models/Company");
const Branch = require("../models/Branch");
const generateToken = require("../utils/generateToken");

// ---------- helpers ----------

const populateUser = (query) =>
  query
    .populate("company")
    .populate({
      path: "branch",
      populate: {
        path: "company",
        select: "name phone address",
      },
    })
    .populate({
      path: "branches",
      populate: {
        path: "company",
        select: "name phone address",
      },
    })
    .populate({
      path: "activeBranch",
      populate: {
        path: "company",
        select: "name phone address",
      },
    });

    
const buildAuthPayload = (user) => {
  const branches = (user.branches || []).filter(Boolean);
  const active =
    user.activeBranch ||
    user.branch ||
    (branches.length === 1 ? branches[0] : null);
  return {
    token: generateToken(user),
    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    company: user.company || null,
    branch: active || null, // legacy single-branch field
    activeBranch: active || null,
    activeBranchId: active ? active._id || active : null,
    branches, // ALL branches the user can use
    needsBranchSelection: branches.length > 1 && !active,
  };
};

// ---------- POST /api/auth/register-company ----------
// Creates Company + Main Branch + Admin in one atomic flow.
exports.registerCompany = async (req, res) => {
  const { companyName, branchName, name, email, password, phone, address } =
    req.body || {};

  if (!companyName || !name || !email || !password) {
    return res
      .status(400)
      .json({ message: "companyName, name, email and password are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const normEmail = email.toLowerCase();
  const exists = await User.findOne({ email: normEmail });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  let createdCompany = null;
  let createdBranch = null;
  let createdUser = null;
  try {
    // Avoid MongoDB transactions here: local standalone MongoDB does not support
    // them. The flow stays ordered and performs best-effort cleanup on failure.
    createdCompany = await Company.create({
      name: companyName,
      phone,
      address,
      email: normEmail,
    });

    createdBranch = await Branch.create({
      name: branchName || "Main Branch",
      company: createdCompany._id,
      address,
      phone,
      isMainBranch: true,
      isActive: true,
    });

    createdUser = await User.create({
      name,
      email: normEmail,
      password,
      role: "admin",
      company: createdCompany._id,
      branches: [createdBranch._id],
      activeBranch: createdBranch._id,
      branch: createdBranch._id,
    });

    await Company.updateOne(
      { _id: createdCompany._id },
      { createdBy: createdUser._id },
    );
    await Branch.updateOne(
      { _id: createdBranch._id },
      { admin: createdUser._id },
    );

    const populated = await populateUser(User.findById(createdUser._id));
    return res.status(201).json(buildAuthPayload(populated));
  } catch (err) {
    console.error("[register-company]", err);
    if (!createdUser) {
      await Promise.allSettled([
        createdBranch
          ? Branch.deleteOne({ _id: createdBranch._id })
          : Promise.resolve(),
        createdCompany
          ? Company.deleteOne({ _id: createdCompany._id })
          : Promise.resolve(),
      ]);
    }
    return res
      .status(500)
      .json({ message: err.message || "Failed to register company" });
  }
};

// ---------- POST /api/auth/register (legacy bootstrap) ----------
exports.register = async (req, res) => {
  try {
    const { name, email, password, companyName, branchName } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(403).json({
        message:
          "Public registration is closed. Use /api/auth/register-company or ask an admin.",
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    req.body = {
      companyName: companyName || `${name}'s Company`,
      branchName: branchName || "Main Branch",
      name,
      email,
      password,
    };
    return exports.registerCompany(req, res);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------- POST /api/auth/login ----------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.isActive === false)
      return res.status(403).json({ message: "Account disabled" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // Auto-pick the only branch the user belongs to if no activeBranch set yet.
    if (
      !user.activeBranch &&
      Array.isArray(user.branches) &&
      user.branches.length === 1
    ) {
      user.activeBranch = user.branches[0];
      user.branch = user.branches[0];
      await user.save();
    }

    const populated = await populateUser(User.findById(user._id));
    return res.json(buildAuthPayload(populated));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------- POST /api/auth/switch-branch ----------
// Body: { branchId }. Updates the user's active branch and returns a fresh token.
exports.switchBranch = async (req, res) => {
  try {
    const { branchId } = req.body || {};
    if (!branchId)
      return res.status(400).json({ message: "branchId is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const memberOf = (user.branches || []).map((b) => b.toString());
    const isAllowed =
      user.role === "super-admin" || memberOf.includes(branchId);
    if (!isAllowed) {
      return res
        .status(403)
        .json({ message: "You are not a member of that branch" });
    }

    // Validate branch belongs to same company (unless super-admin).
    const branch = await Branch.findById(branchId);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    if (
      user.role !== "super-admin" &&
      String(branch.company) !== String(user.company)
    ) {
      return res
        .status(403)
        .json({ message: "Branch is outside your company" });
    }
    if (branch.isActive === false) {
      return res.status(403).json({ message: "Branch is disabled" });
    }

    user.activeBranch = branch._id;
    user.branch = branch._id;
    if (!memberOf.includes(branchId)) user.branches.push(branch._id);
    await user.save();

    const populated = await populateUser(User.findById(user._id));
    return res.json(buildAuthPayload(populated));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------- GET /api/auth/setup-status ----------
exports.setupStatus = async (_req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.json({ firstUserRequired: userCount === 0 });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------- GET /api/auth/me ----------
exports.me = async (req, res) => {
  try {
    const populated = await populateUser(User.findById(req.user._id));
    if (!populated) return res.status(404).json({ message: "User not found" });
    const payload = buildAuthPayload(populated);
    // /me doesn't need a fresh token round-trip; strip it.
    delete payload.token;
    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
