const express = require("express");
const {
  register,
  registerCompany,
  login,
  me,
  setupStatus,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try later" },
});

router.post("/register", authLimiter, register);
router.post("/register-company", authLimiter, registerCompany);
router.post("/login", authLimiter, login);
router.get("/setup-status", setupStatus);
router.get("/me", protect, me);

module.exports = router;
