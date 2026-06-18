const express = require("express");
const {
  createBranch,
  listBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  disableBranch,
  assignUserToBranch,
  removeUserFromBranch,
} = require("../controllers/branchController");
const { protect, isAdmin, requireCompany } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect, isAdmin, requireCompany);

router.route("/").get(listBranches).post(createBranch);
router.route("/:id").get(getBranch).put(updateBranch).delete(deleteBranch);
router.patch("/:id/disable", disableBranch);
router.post("/:id/assign-user", assignUserToBranch);
router.post("/:id/remove-user", removeUserFromBranch);

module.exports = router;
