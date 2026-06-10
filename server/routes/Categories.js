const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryControllers');
const { protect, requireBranch } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect, requireBranch);

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
