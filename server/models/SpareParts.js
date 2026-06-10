const mongoose = require("mongoose");

const sparePartSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    part_no: { type: String, trim: true },
    code: { type: String, trim: true },
    brand: { type: String, trim: true },
    description: { type: String, required: true },
    qty: { type: Number, default: 0 },
    unit: { type: String, default: "PCS" },
    buying_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    compatible_models: [{ type: String }],
  },
  { timestamps: true }
);

sparePartSchema.index({ branch: 1, part_no: 1 });
sparePartSchema.index({ branch: 1, code: 1 });
sparePartSchema.index({ branch: 1, createdAt: -1 });

module.exports = mongoose.model("SparePart", sparePartSchema);
