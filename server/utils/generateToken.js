const jwt = require("jsonwebtoken");

// JWT carries identity + tenant scope. `branchId` is the user's *active* branch.
const generateToken = (user) => {
  const active = user.activeBranch || user.branch || null;
  const branches = Array.isArray(user.branches)
    ? user.branches.map((b) => (b && b._id ? b._id.toString() : b.toString()))
    : [];
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      companyId: user.company ? (user.company._id ? user.company._id.toString() : user.company.toString()) : null,
      branchId: active ? (active._id ? active._id.toString() : active.toString()) : null,
      branchIds: branches,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

module.exports = generateToken;
