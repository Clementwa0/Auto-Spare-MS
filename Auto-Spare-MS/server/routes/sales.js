const express = require('express');
const router = express.Router();
const { createSale} = require("../controllers/salesController");
const { getSales} = require("../controllers/salesController");

router.post('/', createSale);
router.get('/', getSales);

module.exports = router;
