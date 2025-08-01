const Sale = require('../models/sale');
const SparePart = require('../models/SpareParts');

// POST /api/sales → Create a new sale and deduct from part
const createSale = async (req, res) => {
  try {
    const { partId, quantity } = req.body;

    if (!partId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid sale data' });
    }

    const part = await SparePart.findById(partId);
    if (!part) return res.status(404).json({ error: 'Part not found' });

    if (part.qty < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    // Create the sale record
    const sale = await Sale.create({
      part: partId,
      quantity,
      total: part.selling_price * quantity,
      date: new Date(),
    });

    // Deduct quantity
    part.qty -= quantity;
    await part.save();

    res.status(201).json({ message: 'Sale completed', sale });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSales = async (req, res) => {
  try {
    const { today } = req.query;
    const filter = {};

    if (today === 'true') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      filter.date = { $gte: startOfDay };
    }

    const sales = await Sale.find(filter).populate('part');
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

module.exports = {
  createSale,
  getSales,
};
