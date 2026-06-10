const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
    index: true,
  },
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
        ref: "SparePart",
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

saleSchema.index({ branch: 1, date: -1 });

module.exports = mongoose.model("Sale", saleSchema);
