const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    getAllArticlesAdmin,
    deleteArticleAdmin,
    getAllArticlesByUserAdmin,
} =  require("../controller/adminControllers");
const { protect,admin } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(protect, authorizeRoles("admin")); // Protect all routes by default

// Admin routes
router.get("/users", getAllUsers); // Get all users
router.delete("/users/:id", deleteUser); // Delete user
router.get("/articles", getAllArticlesAdmin); // Get all articles
router.delete("/articles/:id", deleteArticleAdmin); // Delete article
router.get("/articles/user/:id", getAllArticlesByUserAdmin); // Get all articles by user

module.exports = router;