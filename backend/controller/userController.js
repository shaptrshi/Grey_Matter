const User = require("../models/userModel");
const { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const userLogin = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const userExist = await User.findOne({ email, role });
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
        isAdmin: userExist.role === "admin",
        token: generateToken(userExist._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ success: false, error: "Server error", error });
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, bio, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    let profilePhoto, publicId;
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, "profile_photos");
      profilePhoto = result.secure_url;
      publicId = result.public_id;
    }  

    const user = new User({ name, email, password, bio, role, profilePhoto, publicId });

    await user.save();

    res.status(201).json({
      success: true,
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
  

    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
  
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, "profile_photos");

      const currentUser = await User.findById(req.user._id).select("publicId profilePhoto");
      if (currentUser.profilePhoto) {
        const publicId = getPublicIdFromUrl(currentUser.profilePhoto);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } 
      
      updateFields.profilePhoto = result.secure_url;
      updateFields.publicId = result.public_id;
    }
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
    const user = await User.findById(req.user._id).populate({
      path: "articles",
      select: "title bannerImage createdAt slug",
      options: { sort: { createdAt: -1 } }, // Sort by createdAt in descending order
    })
    .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      articles: user.articles,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", error });
  }
};

const getPublicUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select("name bio profilePhoto articles")
      .populate({
        path: "articles",
        options: { sort: { createdAt: -1 } },
        select: "title bannerImage createdAt slug author",
      })
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      name: user.name,
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
