const jwt = require("jsonwebtoken");
const User = require("../models/User");

// -------------------------
// AUTH MIDDLEWARE
// -------------------------
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = {
      _id: user._id,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,

      companyId: user.company ? user.company.toString() : null,
      branchId: user.branch ? user.branch.toString() : null,

      company: user.company,
      branch: user.branch,
    };

    req.companyId = req.user.companyId;
    req.branchId = req.user.branchId;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};

// -------------------------
// ROLE CHECK
// -------------------------
const isAdmin = (req, res, next) => {
  if (
    !req.user ||
    !["admin", "super-admin"].includes(req.user.role)
  ) {
    return res.status(403).json({
      message: "Admin access required",
    });
  }
  next();
};

// -------------------------
// BRANCH FILTER (SAFE)
// -------------------------
const getBranchFilter = (req) => {
  if (!req.user) return {};

  if (req.user.role === "super-admin") return {};

  if (!req.user.branchId) return { _id: null };

  return { branch: req.user.branchId };
};

// -------------------------
// COMPANY FILTER (SAFE)
// -------------------------
const getCompanyFilter = (req) => {
  if (!req.user) return {};

  if (req.user.role === "super-admin") return {};

  if (!req.user.companyId) return { _id: null };

  return { company: req.user.companyId };
};

// -------------------------
// REQUIRE COMPANY
// -------------------------
const requireCompany = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role === "super-admin") return next();

  if (!req.user.companyId) {
    return res.status(403).json({
      code: "NO_COMPANY",
      message: "No company assigned. Register a company first.",
    });
  }

  next();
};

// -------------------------
// REQUIRE BRANCH (FIXED)
// -------------------------
const requireBranch = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role === "super-admin") return next();

  // IMPORTANT: allow admin during onboarding edge cases
  if (!req.user.companyId) {
    return res.status(403).json({
      code: "NO_COMPANY",
      message: "No company assigned",
    });
  }

  if (!req.user.branchId) {
    return res.status(403).json({
      code: "NO_BRANCH",
      message: "No branch assigned. Create or join a branch first.",
    });
  }

  next();
};

module.exports = {
  protect,
  isAdmin,
  requireBranch,
  requireCompany,
  getBranchFilter,
  getCompanyFilter,
};