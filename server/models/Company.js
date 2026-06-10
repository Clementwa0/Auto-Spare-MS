const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Company name is required"], trim: true, maxlength: 150 },
    email: { type: String, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, trim: true, maxlength: 40 },
    address: { type: String, trim: true, maxlength: 250 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

companySchema.index({ name: 1 });

module.exports = mongoose.model("Company", companySchema);
