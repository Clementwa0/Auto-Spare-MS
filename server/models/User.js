const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Expanded RBAC: super-admin (cross-company), admin (company owner),
// branch-manager, cashier, storekeeper. "sales" kept for backward compat.
const ROLES = [
  "super-admin",
  "admin",
  "branch-manager",
  "cashier",
  "storekeeper",
  "sales",
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },
    role: { type: String, enum: ROLES, default: "cashier" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null, index: true },

    // Multi-branch membership. A user can belong to N branches in their company.
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
    // Currently selected branch (drives every scoped query).
    activeBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null, index: true },

    // LEGACY single-branch field. Kept in sync with activeBranch so older code
    // that still reads `user.branch` keeps working. New code MUST use
    // `activeBranch` / `branches`.
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null, index: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ company: 1, activeBranch: 1 });
userSchema.index({ company: 1, branches: 1 });

userSchema.pre("save", async function (next) {
  // Keep legacy `branch` mirrored to `activeBranch`.
  if (this.isModified("activeBranch")) this.branch = this.activeBranch;
  // Ensure activeBranch is part of branches.
  if (this.activeBranch && Array.isArray(this.branches)) {
    const has = this.branches.some((b) => String(b) === String(this.activeBranch));
    if (!has) this.branches.push(this.activeBranch);
  }
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.statics.ROLES = ROLES;

module.exports = mongoose.model("User", userSchema);
