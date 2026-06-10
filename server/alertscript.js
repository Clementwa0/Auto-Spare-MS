require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../server/dbConfig/db');
const { checkLowStockParts } = require('../server/services/alerts');

const run = async () => {
  await connectDB();
  await checkLowStockParts();
  mongoose.connection.close();
};

run();
