const express = require("express");
const { createUser, listUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { protect, isAdmin, requireCompany } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect, isAdmin, requireCompany);

router.route("/").get(listUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
