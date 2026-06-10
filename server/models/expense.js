// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String, // Optional: rent, salary, utilities, etc.
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

expenseSchema.index({ branch: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
