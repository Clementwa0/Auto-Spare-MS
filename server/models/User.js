const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["super-admin", "admin", "sales"];

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
    role: { type: String, enum: ROLES, default: "sales" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null, index: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ company: 1, branch: 1 });

userSchema.pre("save", async function (next) {
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
