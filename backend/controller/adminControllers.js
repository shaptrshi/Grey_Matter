const User = require("../models/userModel");
const Article = require("../models/articleModel");
4;
const {
  deleteFromCloudinary,
  getPublicIdFromUrl,
} = require("../utils/cloudinary");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -refreshToken")
      .populate({
        path: "articles",
        select: "title bannerImage createdAt status",
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete all user articles first
    await Article.deleteMany({ author: user._id });

    // Then delete the user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "User and all associated articles deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// @desc    Get all articles
// @route   GET /api/admin/articles
// @access  Private/Admin
const getAllArticlesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const articles = await Article.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Article.countDocuments(query);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};

// @desc    Delete article
// @route   DELETE /api/admin/articles/:id
// @access  Private/Admin
const deleteArticleAdmin = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .select("+imagePublicId")
      .select("bannerImage");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    let cloudinaryDeleted = false;
    const publicId =
      article.imagePublicId || getPublicIdFromUrl(article.bannerImage);

    // Delete from Cloudinary if image exists
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
        cloudinaryDeleted = true;
      } catch (error) {
        console.error("Cloudinary deletion error:", error);
      }
    }

    // Remove article reference from user
    await User.findByIdAndUpdate(article.author, {
      $pull: { articles: article._id },
    });

    await article.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      cloudinaryDeleted,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete article",
    });
  }
};

// @desc    Get all articles by user
// @route   GET /api/admin/users/:id/articles
// @access  Private/Admin
const getAllArticlesByUserAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const articles = await Article.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("author", "name email")
      .lean();

    const count = await Article.countDocuments({ author: req.params.id });

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching user articles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user articles",
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllArticlesAdmin,
  deleteArticleAdmin,
  getAllArticlesByUserAdmin,
};
