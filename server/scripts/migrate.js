/**
 * Migration: backfill Company + Branch for legacy data.
 *
 * Run:  node scripts/migrate.js
 *
 * Idempotent. Safe to run multiple times.
 *
 * What it does:
 *  1. Ensures a "Default Company" exists.
 *  2. Ensures a "Main Branch" exists for that company and marks it isMainBranch.
 *  3. Backfills user.company / user.branch for any user missing them.
 *  4. Backfills category.branch / spare-part.branch / sale.branch / expense.branch
 *     for any document missing a branch.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Company = require("../models/Company");
const Branch = require("../models/Branch");
const Category = require("../models/Category");
const SparePart = require("../models/SpareParts");
const Sale = require("../models/sale");
const Expense = require("../models/expense");

const DEFAULT_COMPANY_NAME = process.env.DEFAULT_COMPANY_NAME || "Default Company";
const DEFAULT_BRANCH_NAME = process.env.DEFAULT_BRANCH_NAME || "Main Branch";

(async () => {
  try {
    await connectDB();
    console.log("[migrate] connected");

    // 1. Default company
    let company = await Company.findOne({ name: DEFAULT_COMPANY_NAME });
    if (!company) {
      company = await Company.create({ name: DEFAULT_COMPANY_NAME });
      console.log("[migrate] created company:", company._id.toString());
    } else {
      console.log("[migrate] reusing company:", company._id.toString());
    }

    // 2. Default main branch
    let branch = await Branch.findOne({ company: company._id, isMainBranch: true });
    if (!branch) {
      // Maybe an existing legacy branch — adopt the first one we find without a company.
      const orphan = await Branch.findOne({ $or: [{ company: null }, { company: { $exists: false } }] });
      if (orphan) {
        orphan.company = company._id;
        orphan.isMainBranch = true;
        orphan.isActive = true;
        await orphan.save();
        branch = orphan;
        console.log("[migrate] adopted existing branch:", branch._id.toString());
      } else {
        branch = await Branch.create({
          name: DEFAULT_BRANCH_NAME,
          company: company._id,
          isMainBranch: true,
          isActive: true,
        });
        console.log("[migrate] created branch:", branch._id.toString());
      }
    } else {
      console.log("[migrate] reusing branch:", branch._id.toString());
    }

    // Attach orphan branches to default company.
    const orphanBranches = await Branch.updateMany(
      { $or: [{ company: null }, { company: { $exists: false } }] },
      { $set: { company: company._id } }
    );
    if (orphanBranches.modifiedCount) {
      console.log(`[migrate] linked ${orphanBranches.modifiedCount} orphan branch(es) to default company`);
    }

    // 3. Backfill users
    const usersMissingCompany = await User.updateMany(
      { $or: [{ company: null }, { company: { $exists: false } }] },
      { $set: { company: company._id } }
    );
    const usersMissingBranch = await User.updateMany(
      { $or: [{ branch: null }, { branch: { $exists: false } }] },
      { $set: { branch: branch._id } }
    );
    console.log(`[migrate] users: +company=${usersMissingCompany.modifiedCount}, +branch=${usersMissingBranch.modifiedCount}`);

    // 4. Backfill domain data
    const tasks = [
      ["Category", Category],
      ["SparePart", SparePart],
      ["Sale", Sale],
      ["Expense", Expense],
    ];
    for (const [label, Model] of tasks) {
      const r = await Model.updateMany(
        { $or: [{ branch: null }, { branch: { $exists: false } }] },
        { $set: { branch: branch._id } }
      );
      console.log(`[migrate] ${label}: +branch=${r.modifiedCount}`);
    }

    console.log("[migrate] done");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[migrate] failed:", err);
    process.exit(1);
  }
})();
