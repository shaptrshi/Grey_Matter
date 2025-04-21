const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");
const {
  userLogin,
  userRegister,
  updateUser,
  userLogout,
} = require("../controller/userController");

// Public routes
router.post("/login", userLogin);
router.post("/register", upload.single("profilePhoto"), userRegister);

// Protected routes
router.put("/update", protect, upload.single("profilePhoto"), updateUser);
router.post("/logout", protect, userLogout);

module.exports = router;
