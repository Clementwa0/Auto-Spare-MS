const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ branch: 1, name: 1 }, { unique: true });
categorySchema.index({ branch: 1, createdAt: -1 });

module.exports = mongoose.model('Category', categorySchema);
