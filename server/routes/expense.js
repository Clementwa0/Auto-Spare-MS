const express = require("express");
const {
  listExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect, requireBranch } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect, requireBranch);

router.route("/").get(listExpenses).post(createExpense);
router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense);

module.exports = router;
