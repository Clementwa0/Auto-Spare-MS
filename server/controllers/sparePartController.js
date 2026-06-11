const SparePart = require('../models/SpareParts');
const Category = require('../models/Category');
const { getBranchFilter } = require('../middleware/authMiddleware');

// Get all spare parts (with optional filters)
const getAllSpareParts = async (req, res) => {
  try {
    const { category, model } = req.query;

    const filter = { ...getBranchFilter(req) };
    if (category) filter.category = category;
    if (model) filter.compatible_models = { $in: [model] };

    const spareParts = await SparePart.find(filter).populate('category', 'name');
    res.json(spareParts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single spare part by ID
const getSparePartById = async (req, res) => {
  try {
    const part = await SparePart.findOne({ _id: req.params.id, ...getBranchFilter(req) }).populate('category', 'name');
    if (!part) return res.status(404).json({ error: 'Spare part not found' });
    res.json(part);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new spare part
const createSparePart = async (req, res) => {
  try {
    const {
      part_no,
      code,
      brand,
      description,
      qty,
      unit,
      buying_price,
      selling_price,
      category,
      compatible_models,
    } = req.body;

    const found = await Category.findOne({ _id: category, ...getBranchFilter(req) });
    if (!found) return res.status(400).json({ error: 'Invalid category ID' });

    const newPart = await SparePart.create({
      part_no,
      code,
      brand,
      description,
      qty,
      unit,
      buying_price,
      selling_price,
      category,
      compatible_models,
      branch: req.branchId,
    });

    res.status(201).json(newPart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update spare part
const updateSparePart = async (req, res) => {
  try {
    if (req.body.category) {
      const found = await Category.findOne({ _id: req.body.category, ...getBranchFilter(req) });
      if (!found) return res.status(400).json({ error: 'Invalid category ID' });
    }

    const updateData = { ...req.body };
    delete updateData.branch;

    const updated = await SparePart.findOneAndUpdate(
      { _id: req.params.id, ...getBranchFilter(req) },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Spare part not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete spare part
const deleteSparePart = async (req, res) => {
  try {
    const removed = await SparePart.findOneAndDelete({ _id: req.params.id, ...getBranchFilter(req) });
    if (!removed) return res.status(404).json({ error: 'Spare part not found' });
    res.json({ message: 'Spare part deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bulkInsert = async (req, res) => {
  try {
    const parts = Array.isArray(req.body) ? req.body : [];
    const inserts = [];

    for (const part of parts) {
      const found = await Category.findOne({ _id: part.category, ...getBranchFilter(req) });
      if (!found) return res.status(400).json({ error: `Invalid category ID for part ${part.description || part.part_no}` });

      inserts.push({ ...part, branch: req.branchId });
    }

    const inserted = await SparePart.insertMany(inserts);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get low stock spare parts (qty <= threshold)
const getLowStockParts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const lowStock = await SparePart.find({ ...getBranchFilter(req), qty: { $lte: threshold } })
      .populate('category', 'name')
      .sort({ 'category.name': 1 });

    res.json({
      count: lowStock.length,
      threshold,
      parts: lowStock.map(part => ({
        _id: part._id,
        part_no: part.part_no,
        code: part.code,
        description: part.description,
        qty: part.qty,
        min: threshold,
        category: part.category?.name || 'Uncategorized',
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllSpareParts,
  getSparePartById,
  createSparePart,
  updateSparePart,
  deleteSparePart,
  bulkInsert,
  getLowStockParts,
};

