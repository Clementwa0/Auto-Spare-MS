const express = require('express');
const {
  getAllSpareParts,
  getSparePartById,
  createSparePart,
  updateSparePart,
  deleteSparePart,
  bulkInsert,
  getLowStockParts,
} = require('../controllers/sparePartController');

const router = express.Router();

router.get('/', getAllSpareParts);
router.get('/low-stock', getLowStockParts); 
router.get('/:id', getSparePartById);
router.post('/', createSparePart);
router.put('/:id', updateSparePart);
router.patch('/:id', updateSparePart); 
router.delete('/:id', deleteSparePart);
router.post('/bulk-insert', bulkInsert);

module.exports = router;
