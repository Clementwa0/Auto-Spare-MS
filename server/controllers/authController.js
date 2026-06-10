const User = require("../models/User");
const Company = require("../models/Company");
const Branch = require("../models/Branch");
const generateToken = require("../utils/generateToken");

// ----------------------
// Helpers
// ----------------------

const buildAuthPayload = (user) => {
  return {
    token: generateToken({
      userId: user._id,
      role: user.role,
      companyId: user.company?._id || user.company,
      branchId: user.branch?._id || user.branch,
    }),

    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    company: user.company || null,
    branch: user.branch || null,
  };
};

// ----------------------
// REGISTER COMPANY (FIXED)
// ----------------------
exports.registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      branchName,
      name,
      email,
      password,
      phone,
      address,
    } = req.body || {};

    if (!companyName || !name || !email || !password) {
      return res.status(400).json({
        message: "companyName, name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normEmail = email.toLowerCase();

    // Check duplicate user
    const exists = await User.findOne({ email: normEmail });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // ----------------------
    // 1. Create Company
    // ----------------------
    const company = await Company.create({
      name: companyName,
      phone,
      address,
      email: normEmail,
    });

    // ----------------------
    // 2. Create Branch
    // ----------------------
    const branch = await Branch.create({
      name: branchName || "Main Branch",
      company: company._id,
      phone,
      address,
      isMainBranch: true,
      isActive: true,
    });

    // ----------------------
    // 3. Create User
    // ----------------------
    const user = await User.create({
      name,
      email: normEmail,
      password,
      role: "admin",
      company: company._id,
      branch: branch._id,
    });

    // ----------------------
    // 4. Link references (no transaction)
    // ----------------------
    company.createdBy = user._id;
    await company.save();

    branch.admin = user._id;
    await branch.save();

    // ----------------------
    // 5. Populate user safely
    // ----------------------
    const populatedUser = await User.findById(user._id)
      .populate("company")
      .populate("branch");

    return res.status(201).json(buildAuthPayload(populatedUser));
  } catch (err) {
    console.error("[register-company ERROR]", err);
    return res.status(500).json({
      message: err.message || "Failed to register company",
    });
  }
};

// ----------------------
// LEGACY REGISTER (FIXED)
// ----------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password are required",
      });
    }

    const userCount = await User.countDocuments();

    if (userCount > 0) {
      return res.status(403).json({
        message:
          "Public registration is closed. Use register-company instead.",
      });
    }

    req.body.companyName = `${name}'s Company`;
    req.body.branchName = "Main Branch";

    return exports.registerCompany(req, res);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ----------------------
// LOGIN (FIXED)
// ----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const populatedUser = await User.findById(user._id)
      .populate("company")
      .populate("branch");

    return res.json(buildAuthPayload(populatedUser));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ----------------------
// SETUP STATUS
// ----------------------
exports.setupStatus = async (_req, res) => {
  try {
    const count = await User.countDocuments();
    return res.json({ firstUserRequired: count === 0 });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ----------------------
// ME
// ----------------------
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("company")
      .populate("branch");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      company: user.company || null,
      branch: user.branch || null,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};