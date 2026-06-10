const express = require('express');
const router = express.Router();
const {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
} = require("../controllers/salesController");
const { protect, requireBranch } = require('../middleware/authMiddleware');

router.use(protect, requireBranch);

router.post('/', createSale);
router.get('/', getSales);
router.route('/:id').get(getSaleById).put(updateSale).delete(deleteSale);

module.exports = router;
