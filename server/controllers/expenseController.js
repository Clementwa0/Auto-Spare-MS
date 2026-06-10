const Expense = require("../models/expense");
const { getBranchFilter } = require("../middleware/authMiddleware");

exports.listExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ ...getBranchFilter(req) }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, ...getBranchFilter(req) });
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: "Invalid expense id" });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    if (!description || amount == null) {
      return res.status(400).json({ error: "description and amount are required" });
    }

    const expense = await Expense.create({ description, amount, category, date, branch: req.branchId });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.branch;

    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, ...getBranchFilter(req) },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Expense not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const removed = await Expense.findOneAndDelete({ _id: req.params.id, ...getBranchFilter(req) });
    if (!removed) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid expense id" });
  }
};
