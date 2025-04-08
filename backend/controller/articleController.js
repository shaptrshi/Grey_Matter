const Article = require('../models/articleModel');
const Author = require('../models/authorModel');
const mongoose = require('mongoose');

// Create an article
const createArticle = async (req, res) => {
    try {
        const { title, content, bannerImage, tags, isFeatured, authorId} = req.body;

        if (!title || !content || !authorId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }

        const author = await Author.findById(authorId);

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        const article = new Article({
            title,
            content,
            bannerImage,
            tags,
            isFeatured,
            author: authorId, // Include the author field
        });

        await article.save();

        author.articles.push(article._id);
        await author.save();

        res.status(201).json({ message: "Article created successfully", article });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Error creating article:", error);
    }
};

// Get all articles
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('author', 'name email').lean();
        res.status(200).json(articles);
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Get articles by genre (tag)
const getArticleByGenre = async (req, res) => {
    try {
        const {tag} = req.params;

        //Fetch articles by tag
        const articles = await Article.find({tags: tag})
            .populate('author', 'name email')
            .lean();
        
        res.status(200).json(articles);    
    } catch (error) {
        console.error("Error fetching articles by genre:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get a single article with better error handling
const getArticleById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid article ID" });
        }

        const article = await Article.findById(req.params.id).populate('author', 'name email bio').lean();
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Latest Articles
const getLatestArticles = async (req, res) => {
    try {
        const latestArticles = await Article.find()
            .sort({ createdAt: -1 })
            .limit(4)
            .populate('author', 'name email')
            .lean();
        res.status(200).json(latestArticles);    
    } catch (error) {
        console.error("Error fetching latest articles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Get Random Articles
const getRandomArticles = async (req, res) => {
    try {
        const randomArticles = await Article.aggregate([
            { $sample: { size: 4 } }
        ]);

        res.status(200).json(randomArticles);
    } catch (error) {
        console.error("Error fetching random articles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Get articles by a specific author
const getArticlesByAuthor = async (req, res) => {
    try {
        const {authorId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }

        const author = await Author.findById(authorId);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        //Fetch articles by author
        const articles = await Article.find({author: authorId})
            .populate('author', 'name email')
            .lean();
        
        res.status(200).json(articles);    
    } catch (error) {
        console.error("Error fetching articles by author:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update an article with better naming
const updateArticle = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid article ID" });
        }

        const { title, content, bannerImage, tags } = req.body;

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            { title, content, bannerImage, tags },
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.status(200).json(updatedArticle);
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete an article with proper reference removal
const deleteArticle = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid article ID" });
        }

        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Remove reference from author's articles array
        await Author.findByIdAndUpdate(
            article.author,
            { $pull: { articles: article._id } }
        );

        await article.deleteOne();

        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//isFeatured articles
const getFeaturedArticles = async (req, res) => {
    try {
        const featuredArticles = await Article.find({ isFeatured: true })
            .populate('author', 'name email')
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
    getLatestArticles,
    getRandomArticles,
    getArticleByGenre,
    getArticlesByAuthor,
    getFeaturedArticles,
    updateArticle,
    deleteArticle,
};
