const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (userExist && (await userExist.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: userExist._id,
        email: userExist.email,
        role: userExist.role,
        token: generateToken(userExist._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", error });
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, bio } = req.body;
    const profilePhoto = req.file ? req.file.path : null;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (password != confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ succes: false, message: "User already exists" });
    }

    const user = new User({ name, email, password, bio, profilePhoto });
    delete user.confirmPassword;

    await user.save();

    res.status(201).json({
      succes: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Error: ", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const profilePhoto = req.file ? req.file.path : undefined;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (profilePhoto) updateFields.profilePhoto = profilePhoto;

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    );

    if (!updateUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      role: updateUser.role,
      bio: updateUser.bio,
      profilePhoto: updateUser.profilePhoto,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", error });
  }
};

module.exports = { userLogin, userRegister, updateUser, userLogout };