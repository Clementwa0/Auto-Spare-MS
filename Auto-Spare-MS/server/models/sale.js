const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
  },
  items: [
    {
      part: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part",
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      selling_price: {
        type: Number,
        required: true,
      },
      buying_price: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Sale", saleSchema);
