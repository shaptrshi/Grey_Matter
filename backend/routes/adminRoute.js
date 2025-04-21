const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllArticlesAdmin,
  deleteArticleAdmin,
  getAllArticlesByUserAdmin,
} = require("../controller/adminControllers");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Apply protection and role authorization to all admin routes
router.use(protect);
router.use(authorizeRoles("admin"));

// Admin routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/articles", getAllArticlesAdmin);
router.delete("/articles/:id", deleteArticleAdmin);
router.get("/articles/user/:id", getAllArticlesByUserAdmin);

module.exports = router;
