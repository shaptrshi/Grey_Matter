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

    const userExist = await User.findOne({ email }).populate('articles');
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
        name: userExist.name,
        role: userExist.role,
        bio: userExist.bio,
        profilePhoto: userExist.profilePhoto,
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

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("articles");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      articles: user.articles, // This will now be populated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", error });
  }
};

const getPublicUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID and populate only necessary article fields
    const user = await User.findById(userId)
      .select("name bio profilePhoto email articles") // Only public fields
      .populate({
        path: "articles",
        select: "title bannerImage createdAt slug", // customize fields as needed
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      name: user.name,
      email: user.email, // include only if it's meant to be public
      bio: user.bio,
      profilePicture: user.profilePhoto,
      articles: user.articles.map((article) => ({
        id: article._id,
        title: article.title,
        bannerImage: article.bannerImage,
        date: article.createdAt,
        link: `/article/${article.slug || article._id}`, // build link as needed
        author: user.name,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


module.exports = {
  userLogin,
  userRegister,
  updateUser,
  userLogout,
  userProfile,
  getPublicUserProfile,
};