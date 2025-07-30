const SparePart = require('../models/SpareParts');
const Category = require('../models/Category');

// Get all spare parts (with optional filters)
const getAllSpareParts = async (req, res) => {
  try {
    const { category, model } = req.query;

    const filter = {};
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
    const part = await SparePart.findById(req.params.id).populate('category', 'name');
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

    const found = await Category.findById(category);
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
    });

    res.status(201).json(newPart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update spare part
const updateSparePart = async (req, res) => {
  try {
    const updated = await SparePart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Spare part not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete spare part
const deleteSparePart = async (req, res) => {
  try {
    const removed = await SparePart.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Spare part not found' });
    res.json({ message: 'Spare part deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/sparePartController.js
const bulkInsert = async (req, res) => {
  try {
    const inserted = await SparePart.insertMany(req.body);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get low stock spare parts (qty <= threshold)
const getLowStockParts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 3;

    const lowStock = await SparePart.find({ qty: { $lte: threshold } })
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

