const express = require('express');
const {
  getAllSpareParts,
  getSparePartById,
  createSparePart,
  updateSparePart,
  deleteSparePart,
} = require('../controllers/sparePartController');

const router = express.Router();

// GET all spare parts (with optional filtering)
router.get('/', getAllSpareParts);

// GET single spare part by ID
router.get('/:id', getSparePartById);

// POST create new spare part
router.post('/', createSparePart);

// PUT update spare part
router.put('/:id', updateSparePart);

// DELETE spare part
router.delete('/:id', deleteSparePart);

module.exports = router;
