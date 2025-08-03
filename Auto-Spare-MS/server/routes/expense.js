// routes/expenses.js
const express = require("express");
const Expense = require("../models/expense");

const router = express.Router();

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST a new expense
router.post("/", async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    const newExpense = new Expense({ description, amount, category });
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create expense" });
  }
});

module.exports = router;
