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
      .sort({ createdAt: -1 }) 
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
      .select("-__v -updatedAt")
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
    const { sort = "latest", page = 1, limit = 8 } = req.query;

    const pageNumber = isNaN(parseInt(page)) ? 1 : parseInt(page);
    const limitNumber = isNaN(parseInt(limit)) ? 8 : parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;
    
    let sortOptions = {}

    switch (sort) {
      case "latest":
        sortOptions = { createdAt: -1 }; 
        break;
      case "oldest":
        sortOptions = { createdAt: 1 }; 
        break;
      case "title-asc":
        sortOptions = { title: 1 }; 
        break;
      case "title-desc":
        sortOptions = { title: -1 }; 
        break;
      default:
        sortOptions = { createdAt: -1 };
    }          

    const articles = await Article.find({ tags: tag })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .populate("author", "name email")
      .lean();

      const total = await Article.countDocuments({ tags: tag });
      const totalPages = Math.ceil(total / limitNumber);
    res.status(200).json({
      data: articles,
      currentPage: pageNumber,
      totalPages: totalPages,
      totalArticles: total
    });
  } catch (error) {
    console.error("Error fetching articles by genre:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getArticlesForHomeByGenre = async (req, res) => {
  try {
    const { tag } = req.params;

    const articles = await Article.find({ tags: tag })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("title author createdAt bannerImage")
      .populate("author", "name email")
      .lean();

    res.status(200).json({ data: articles });
  } catch (error) {
    console.error("Error fetching articles for home by genre:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get Latest Articles
const getLatestArticles = async (req, res) => {
  try {
    const latestarticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("title author createdAt bannerImage")
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
    // Step 1: Get just the IDs of 4 random articles (very lightweight)
    const randomArticleIds = await Article.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1 } }
    ]);
    
    // Step 2: Fetch only those 4 articles with author data
    const selected = await Article.find({
      _id: { $in: randomArticleIds.map(a => a._id) }
    }).populate("author", "name email").lean();

    res.status(200).json({ articles: selected });
  } catch (error) {
    console.error("Error fetching random articles:", error);
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
      .select("title author createdAt bannerImage")
      .sort({ createdAt: -1 })
      .populate("author", "name email")
      .lean();
    res.status(200).json(featuredArticles);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchArticles = async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;

    // Validate the query parameter
    if (!query.trim()) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Ensure page and limit are valid numbers
    const pageNumber = parseInt(page) || 1;
    const limitNumber = Math.min(parseInt(limit) || 10, 100); // Max limit of 100
    const skip = (pageNumber - 1) * limitNumber;

    const regex = new RegExp(query, "i"); // Case-insensitive search

    const filter = {
      $or: [
        { title: regex },
        { content: regex },
        { tags: regex },
      ],
    };

    // Fetch articles with pagination
    const articles = await Article.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .populate("author", "name email")
      .lean();

    // Get the total number of matching articles for pagination
    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      data: articles,
      currentPage: pageNumber,
      totalPages,
      totalArticles: total,
    });
  } catch (error) {
    console.error("Error searching articles:", error);
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
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
  searchArticles,
  getArticlesForHomeByGenre,
};
