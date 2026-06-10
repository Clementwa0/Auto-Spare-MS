const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId || user._id,
      role: user.role,
      companyId:
        user.companyId ||
        user.company?._id?.toString?.() ||
        user.company?.toString?.() ||
        null,

      branchId:
        user.branchId ||
        user.branch?._id?.toString?.() ||
        user.branch?.toString?.() ||
        null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1HR" }
  );
};

module.exports = generateToken;