const express = require("express");
const { createUser } = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, isAdmin, createUser);

module.exports = router;
