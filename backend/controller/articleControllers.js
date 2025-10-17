// controllers/articleController.js
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} = require("../utils/cloudinary");

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  // try JSON parse (frontend might send JSON string) else split by comma
  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // not JSON - continue
  }
  return tags
    .toString()
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const parseBoolean = (val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const s = val.toLowerCase().trim();
    return s === "true" || s === "1" || s === "yes";
  }
  return Boolean(val);
};

// Create article (store imagePublicId consistently)
const createArticle = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, content } = req.body;
    let { tags, isFeatured } = req.body;
    const authorId = req.user._id; // Logged-in user's ID

    if (!title || !content) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Title and content are required" });
    }

    tags = parseTags(tags);
    isFeatured = parseBoolean(isFeatured);

    if (!req.file || !req.file.buffer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Banner image is required" });
    }

    // upload image
    const result = await uploadOnCloudinary(req.file.buffer, "article-banners");
    const bannerImage = result.secure_url;
    const imagePublicId = result.public_id; // consistent field name

    const article = new Article({
      title,
      content,
      bannerImage,
      imagePublicId,
      tags,
      isFeatured,
      author: authorId,
    });

    await article.save({ session });

    // push to user articles
    await User.findByIdAndUpdate(
      authorId,
      { $push: { articles: article._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid article ID" });
    }
    const article = await Article.findById(id)
      .select("-__v -updatedAt")
      .populate("author", "name email")
      .lean();
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ success: true, article });
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

    let sortOptions = {};
    switch (sort) {
      case "latest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "title-asc":
      case "title-ascending":
        sortOptions = { title: 1 };
        break;
      case "title-desc":
      case "title-descending":
        sortOptions = { title: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const filter = tag ? { tags: tag } : {};

    const articles = await Article.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .populate("author", "name email")
      .lean();

    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNumber);
    res.status(200).json({
      data: articles,
      currentPage: pageNumber,
      totalPages,
      totalArticles: total,
    });
  } catch (error) {
    console.error("Error fetching articles by genre:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get articles for home by genre (small list)
const getArticlesForHomeByGenre = async (req, res) => {
  try {
    const { tag } = req.params;

    let query = {};
    if (tag === "featured") {
      query = { isFeatured: true };
    } else if (tag === "latest") {
      query = {};
    } else if (tag) {
      query = { tags: tag };
    }

    const articles = await Article.find(query)
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
    const latestArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("title author createdAt bannerImage")
      .populate("author", "name email")
      .lean();
    res.status(200).json(latestArticles);
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get random articles
const getRandomArticles = async (req, res) => {
  try {
    const randomArticleIds = await Article.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1 } },
    ]);

    const selected = await Article.find({
      _id: { $in: randomArticleIds.map((a) => a._id) },
    })
      .populate("author", "name email")
      .lean();

    res.status(200).json({ articles: selected });
  } catch (error) {
    console.error("Error fetching random articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an article (only author)
const updateArticle = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    let { title, content, tags, isFeatured } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await Article.findById(id).select("+imagePublicId");

    if (!article) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Unauthorized to update this article" });
    }

    tags = parseTags(tags);
    isFeatured = typeof isFeatured !== "undefined" ? parseBoolean(isFeatured) : article.isFeatured;

    const oldImagePublicId = article.imagePublicId;
    const oldBannerImage = article.bannerImage;
    let newImageResult = null;

    // If new file provided -> upload first (so we only delete old after success)
    if (req.file && req.file.buffer) {
      try {
        newImageResult = await uploadOnCloudinary(req.file.buffer, "article-banners");
        article.bannerImage = newImageResult.secure_url;
        article.imagePublicId = newImageResult.public_id;

        // delete old image if present (best effort)
        if (oldImagePublicId) {
          try {
            await deleteFromCloudinary(oldImagePublicId);
            console.log("Old image deleted from Cloudinary");
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
            // don't fail the whole update for deletion problems
          }
        }
      } catch (uploadError) {
        console.error("Error uploading new image:", uploadError);
        // revert to old values and throw to abort
        article.bannerImage = oldBannerImage;
        article.imagePublicId = oldImagePublicId;
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Failed to upload new image" });
      }
    }

    // Update other fields
    article.title = title || article.title;
    article.content = content || article.content;
    article.tags = tags.length ? tags : article.tags;
    article.isFeatured = typeof isFeatured !== "undefined" ? isFeatured : article.isFeatured;

    const updatedArticle = await article.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating article:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

// Delete an article (only author)
const deleteArticle = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await Article.findById(id)
      .select("+imagePublicId")
      .select("author bannerImage imagePublicId");

    if (!article) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Unauthorized" });
    }

    let cloudinaryDeleted = false;
    const publicId = article.imagePublicId || getPublicIdFromUrl(article.bannerImage);

    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
        cloudinaryDeleted = true;
      } catch (error) {
        console.error("Cloudinary deletion error:", error);
        // continue — don't block deletion of DB record
      }
    }

    await Article.deleteOne({ _id: id }, { session });
    await User.findByIdAndUpdate(userId, { $pull: { articles: id } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Article deleted",
      cloudinaryDeleted,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Error deleting article" });
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
    if (!query || !query.toString().trim()) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = Math.min(parseInt(limit) || 10, 100); // Max limit of 100
    const skip = (pageNumber - 1) * limitNumber;

    const regex = new RegExp(query, "i"); // Case-insensitive search

    const filter = {
      $or: [{ title: regex }, { content: regex }, { tags: regex }],
    };

    const articles = await Article.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .populate("author", "name email")
      .lean();

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
