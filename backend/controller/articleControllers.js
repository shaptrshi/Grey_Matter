const Article = require("../models/articleModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const createArticle = async (req, res) => {
  try {
    const { title, content, bannerImage, tags, isFeatured } = req.body;
    const authorId = req.user._id; // Logged-in user's ID
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const article = new Article({
      title,
      content,
      bannerImage,
      tags,
      isFeatured,
      author: authorId, // use logged-in user as author
    });

    await article.save();

    await User.findByIdAndUpdate(authorId, {
      $push: { articles: article._id },
    });

    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email")
      .lean();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single article
const getArticleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ succes: false, message: "Invalid article ID" });
    }
    const article = await Article.findById(req.params.id)
      .populate("author", "name email")
      .lean();
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get articles by genre (tag)
const getArticleByGenre = async (req, res) => {
  try {
    const { tag } = req.params;
    const articles = await Article.find({ tags: tag })
      .populate("author", "name email")
      .lean();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles by genre:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Latest Articles
const getLatestArticles = async (req, res) => {
  try {
    const latestarticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("author", "name email")
      .lean();
    res.status(200).json(latestarticles);
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get random articles
const getRandomArticles = async (req, res) => {
  try {
    const allArticles = await Article.find()
      .populate("author", "name email")
      .lean();

    const shuffled = allArticles.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    res.status(200).json({ articles: selected });
  } catch (error) {
    console.error("Error fetching random articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get articles by specific author (anyone can access)
const getArticlesByAuthorPublic = async (req, res) => {
  try {
    const { Id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const articles = await Article.find({ author: Id })
      .populate("author", "name email")
      .lean();

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles by author:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an article (only author can access)
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, bannerImage, tags, isFeatured } = req.body;
    const userId = req.user._id; // Logged-in user's ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this article" });
    }

    // Update the article
    article.title = title || article.title;
    article.content = content || article.content;
    article.bannerImage = bannerImage || article.bannerImage;
    article.tags = tags || article.tags;
    article.isFeatured = isFeatured || article.isFeatured;

    await article.save();

    res.status(200).json({ message: "Article updated successfully", article });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Detete an article (only author can access)
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Logged-in user's ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this article" });
    }

    await article.deleteOne();

    await User.findByIdAndUpdate(userId, { $pull: { articles: id } });

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all featured articles
const getFeaturedArticles = async (req, res) => {
  try {
    const featuredArticles = await Article.find({ isFeatured: true })
      .populate("author", "name email")
      .lean();
    res.status(200).json(featuredArticles);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleByGenre,
  getLatestArticles,
  getRandomArticles,
  getArticlesByAuthorPublic,
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
};
