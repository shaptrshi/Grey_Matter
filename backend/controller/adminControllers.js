const User = require("../models/userModel");
const Article = require("../models/articleModel");

//Get all users(Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Delete a user (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get all articles (Admin Only)
const getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.find({})
      .populate("author", "name email")
      .lean();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Delete any article (Admin Only)
const deleteArticleAdmin = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    await article.deleteOne();
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all articles by user (Admin Only)
const getAllArticlesByUserAdmin = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.params.id })
      .populate("author", "name email")
      .lean();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllArticlesAdmin,
  deleteArticleAdmin,
  getAllArticlesByUserAdmin,
};
