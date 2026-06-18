const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Multi-tenant auth stack.
 *
 *   protect         -> verifies JWT, hydrates req.user with company + branches
 *   companyScope    -> ensures req.user has a company; injects req.companyId
 *   branchScope     -> ensures an active branch is set; injects req.branchId
 *   requireCompany  -> hard gate (returns 403 NO_COMPANY)
 *   requireBranch   -> hard gate (returns 403 NO_BRANCH)
 *   authorize(...r) -> RBAC role gate
 *   isAdmin         -> legacy convenience (admin/super-admin)
 *
 *   getBranchFilter(req)  -> mongo filter for branch-scoped collections
 *   getCompanyFilter(req) -> mongo filter for company-scoped collections
 */

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    if (user.isActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const activeBranchId =
      (user.activeBranch && user.activeBranch.toString()) ||
      (user.branch && user.branch.toString()) ||
      null;
    const branchIds = (user.branches || []).map((b) => b.toString());

    // Optional client override via header — only honoured if the user is a
    // member of that branch (or super-admin). Lets the client switch context
    // without minting a new token on every page.
    const headerBranch = req.headers["x-branch-id"];
    let effectiveBranch = activeBranchId;
    if (headerBranch && typeof headerBranch === "string") {
      if (user.role === "super-admin" || branchIds.includes(headerBranch)) {
        effectiveBranch = headerBranch;
      }
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.company ? user.company.toString() : null,
      branchId: effectiveBranch,
      activeBranchId: effectiveBranch,
      branchIds,
      company: user.company || null,
      branch: user.branch || null,
    };
    req.branchId = effectiveBranch;
    req.companyId = req.user.companyId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "super-admin")) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Generic RBAC gate. Usage: router.post("/", authorize("admin","branch-manager"), handler)
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    if (req.user.role === "super-admin") return next();
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient role" });
    }
    next();
  };

// Soft middleware: just makes sure companyId is loaded onto the request.
const companyScope = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  req.companyId = req.user.companyId;
  next();
};

// Soft middleware: makes sure branchId is loaded onto the request (does not
// 403 by itself — pair with requireBranch when a branch is mandatory).
const branchScope = (req, _res, next) => {
  if (req.user) req.branchId = req.user.branchId;
  next();
};

const getBranchFilter = (req) => {
  if (!req.user) return {};
  if (req.user.role === "super-admin") return {};
  return { branch: req.branchId };
};

const getCompanyFilter = (req) => {
  if (!req.user) return {};
  if (req.user.role === "super-admin") return {};
  return { company: req.companyId };
};

const requireBranch = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (req.user.role === "super-admin") return next();
  if (!req.user.branchId) {
    return res.status(403).json({
      code: "NO_BRANCH",
      message: "No branch assigned. Create or select a branch first.",
      branchIds: req.user.branchIds || [],
    });
  }
  next();
};

const requireCompany = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (req.user.role === "super-admin") return next();
  if (!req.user.companyId) {
    return res.status(403).json({
      code: "NO_COMPANY",
      message: "No company assigned. Register a company first.",
    });
  }
  next();
};

module.exports = {
  protect,
  isAdmin,
  authorize,
  companyScope,
  branchScope,
  requireBranch,
  requireCompany,
  getBranchFilter,
  getCompanyFilter,
};
