const Branch = require("../models/Branch");
const User = require("../models/User");
const { getCompanyFilter } = require("../middleware/authMiddleware");

// POST /api/branches  (admin) — new branch under the admin's company.
exports.createBranch = async (req, res) => {
  try {
    const { name, address, location, phone, isMainBranch } = req.body || {};
    if (!name)
      return res.status(400).json({ message: "Branch name is required" });

    if (!req.user.companyId && req.user.role !== "super-admin") {
      return res
        .status(400)
        .json({ message: "Register a company before creating branches" });
    }

    const branch = await Branch.create({
      name,
      address: address || location,
      location,
      phone,
      company: req.user.companyId,
      admin: req.user._id,
      isMainBranch: !!isMainBranch,
      isActive: true,
    });

    // Auto-attach the creating admin as a member of the new branch.
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { branches: branch._id },
      ...(!req.user.branchId
        ? { activeBranch: branch._id, branch: branch._id }
        : {}),
    });

    return res.status(201).json({ branch });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "A branch with that name already exists" });
    }
    return res.status(500).json({ message: err.message });
  }
};

exports.listBranches = async (req, res) => {
  try {
    const branches = await Branch.find(getCompanyFilter(req))
      .populate("company", "name phone address")
      .sort({
        isMainBranch: -1,
        createdAt: -1,
      });

    return res.json({ branches });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getBranch = async (req, res) => {
  try {
    const branch = await Branch.findOne({
      _id: req.params.id,
      ...getCompanyFilter(req),
    })
      .populate("company", "name phone address");

    if (!branch)
      return res.status(404).json({ message: "Branch not found" });

    return res.json({ branch });
  } catch (err) {
    return res.status(400).json({ message: "Invalid branch id" });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const updates = {};
    [
      "name",
      "address",
      "location",
      "phone",
      "isMainBranch",
      "isActive",
    ].forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, ...getCompanyFilter(req) },
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    return res.json({ branch });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// PATCH /api/branches/:id/disable
exports.disableBranch = async (req, res) => {
  try {
    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, ...getCompanyFilter(req) },
      { $set: { isActive: false } },
      { new: true },
    );
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    return res.json({ branch });
  } catch (err) {
    return res.status(400).json({ message: "Invalid branch id" });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findOneAndDelete({
      _id: req.params.id,
      ...getCompanyFilter(req),
    });
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    // Clean up: pull this branch from every member; clear activeBranch if matched.
    await User.updateMany(
      { branches: branch._id },
      { $pull: { branches: branch._id } },
    );
    await User.updateMany(
      { activeBranch: branch._id },
      { $set: { activeBranch: null, branch: null } },
    );

    return res.json({ message: "Branch deleted", id: req.params.id });
  } catch (err) {
    return res.status(400).json({ message: "Invalid branch id" });
  }
};

// POST /api/branches/:id/assign-user  body: { userId }
// Adds the user as a MEMBER of the branch (multi-branch). Does not steal the
// user from another branch — sets activeBranch only if they have none.
exports.assignUserToBranch = async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const branch = await Branch.findOne({
      _id: req.params.id,
      ...getCompanyFilter(req),
    });
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    const scope =
      req.user.role === "super-admin" ? {} : { company: req.user.companyId };
    const update = {
      $addToSet: { branches: branch._id },
      $set: { company: branch.company },
    };

    // Set activeBranch / legacy branch only if the user has none.
    const existing = await User.findOne({ _id: userId, ...scope });
    if (!existing)
      return res
        .status(404)
        .json({ message: "User not found in your company" });
    if (!existing.activeBranch) {
      update.$set.activeBranch = branch._id;
      update.$set.branch = branch._id;
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, ...scope },
      update,
      { new: true },
    )
      .populate("branches")
      .populate("activeBranch");

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// POST /api/branches/:id/remove-user  body: { userId }
exports.removeUserFromBranch = async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const branch = await Branch.findOne({
      _id: req.params.id,
      ...getCompanyFilter(req),
    });
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    const scope =
      req.user.role === "super-admin" ? {} : { company: req.user.companyId };
    const user = await User.findOne({ _id: userId, ...scope });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found in your company" });

    user.branches = (user.branches || []).filter(
      (b) => String(b) !== String(branch._id),
    );
    if (String(user.activeBranch) === String(branch._id)) {
      user.activeBranch = user.branches[0] || null;
      user.branch = user.activeBranch;
    }
    await user.save();
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
