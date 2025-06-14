const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllArticlesAdmin,
  deleteArticleAdmin,
  getAllArticlesByUserAdmin
} = require("../controller/adminControllers");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Protect all admin routes
router.use(protect);
router.use(authorizeRoles("admin"));

// User management routes
router.route("/users")
  .get(getAllUsers);

router.route("/users/:id")
  .delete(deleteUser);

// Article management routes
router.route("/articles")
  .get(getAllArticlesAdmin);

router.route("/articles/:id")
  .delete(deleteArticleAdmin);

// User-specific article routes
router.route("/users/:id/articles")
  .get(getAllArticlesByUserAdmin);

module.exports = router;