const express = require('express');
const router = express.Router();
const {
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
} = require("../controller/articleControllers");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

//Public routes
router.get("/", getAllArticles); // Get all articles
router.get("/latest", getLatestArticles); // Get latest articles
router.get("/random", getRandomArticles); // Get random articles
router.get("/featured", getFeaturedArticles); // Get featured articles
router.get("/home/:tag", getArticlesForHomeByGenre); // Get articles for home by genre
router.get("/genre/:tag", getArticleByGenre); // Get articles by genre
router.get("/search", searchArticles); // Search articles
router.get("/:id", getArticleById); // Get article by ID


//Protected routes
router.post("/", protect, authorizeRoles("author"), upload.single("bannerImage"), createArticle); // Create an article
router.put("/:id", protect, authorizeRoles("author"), upload.single("bannerImage"), updateArticle); // Update an article
router.delete("/:id", protect, authorizeRoles("author"), deleteArticle); // Delete an article

module.exports = router;