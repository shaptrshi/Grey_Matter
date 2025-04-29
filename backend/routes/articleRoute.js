const express = require('express');
const router = express.Router();
const {
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
} = require("../controller/articleControllers");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

//Public routes
router.get("/", getAllArticles); // Get all articles
router.get("/latest", getLatestArticles); // Get latest articles
router.get("/random", getRandomArticles); // Get random articles
router.get("/featured", getFeaturedArticles); // Get featured articles
router.get("/genre/:tag", getArticleByGenre); // Get articles by genre
router.get("/author/:Id", getArticlesByAuthorPublic); // Get articles by author (public)
router.get("/:id", getArticleById); // Get article by ID

//Protected routes
router.post("/", protect, authorizeRoles("author"), createArticle); // Create an article
router.put("/:id", protect, authorizeRoles("author"), updateArticle); // Update an article
router.delete("/:id", protect, authorizeRoles("author"), deleteArticle); // Delete an article

module.exports = router;