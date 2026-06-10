const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Branch name is required"], trim: true, maxlength: 120 },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    address: { type: String, trim: true, maxlength: 250 },
    // Legacy alias kept for backwards compatibility with old clients.
    location: { type: String, trim: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40 },
    isMainBranch: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

branchSchema.index({ company: 1, name: 1 }, { unique: true });
branchSchema.index({ company: 1, isMainBranch: 1 });

module.exports = mongoose.model("Branch", branchSchema);
