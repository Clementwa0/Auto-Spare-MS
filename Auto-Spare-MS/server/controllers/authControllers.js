const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid Credentials" })
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    })
};
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
};

module.exports = { login, getMe };
