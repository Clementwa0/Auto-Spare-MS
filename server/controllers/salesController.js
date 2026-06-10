const Sale = require("../models/sale");
const SparePart = require("../models/SpareParts");
const { getBranchFilter } = require("../middleware/authMiddleware");

// POST /api/sales – Accepts full cart
const createSale = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No sale items provided" });
    }

    let total = 0;

    for (const item of items) {
      const { part, qty, selling_price, buying_price } = item;

      if (!part || !qty || qty <= 0 || !selling_price || !buying_price) {
        return res.status(400).json({ error: "Invalid sale item data" });
      }

      const partDoc = await SparePart.findOne({ _id: part, ...getBranchFilter(req) });
      if (!partDoc) return res.status(404).json({ error: `Part not found: ${part}` });

      if (partDoc.qty < qty) {
        return res.status(400).json({ error: `Not enough stock for ${partDoc.description}` });
      }

      // Deduct stock
      partDoc.qty -= qty;
      await partDoc.save();

      total += selling_price * qty;
    }

    const sale = await Sale.create({
      items,
      total,
      date: new Date(),
      branch: req.branchId,
    });

    res.status(201).json({ message: "Sale completed", sale });
  } catch (err) {
    console.error("Create sale error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getSales = async (req, res) => {
  try {
    const { today } = req.query;
    const filter = { ...getBranchFilter(req) };

    if (today === 'true') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      filter.date = { $gte: startOfDay };
    }

    const sales = await Sale.find(filter);
    res.status(200).json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, ...getBranchFilter(req) });
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.status(200).json(sale);
  } catch (err) {
    res.status(400).json({ error: "Invalid sale id" });
  }
};

const updateSale = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.branch;

    const updated = await Sale.findOneAndUpdate(
      { _id: req.params.id, ...getBranchFilter(req) },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Sale not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const removed = await Sale.findOneAndDelete({ _id: req.params.id, ...getBranchFilter(req) });
    if (!removed) return res.status(404).json({ error: "Sale not found" });
    res.status(200).json({ message: "Sale deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid sale id" });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};
