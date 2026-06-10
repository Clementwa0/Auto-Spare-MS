require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./dbConfig/db');
const { checkLowStockParts } = require('./services/alerts');

const run = async () => {
  await connectDB();
  await checkLowStockParts();
  mongoose.connection.close();
};

run();
