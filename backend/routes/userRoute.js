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
  userProfile,
  getPublicUserProfile,
} = require("../controller/userController");

// Public routes
router.post("/login", userLogin);
router.post("/register", upload.single("profilePhoto"), userRegister);
router.get("/public/:id", getPublicUserProfile); 

// Protected routes
router.put("/update", protect, upload.single("profilePhoto"), updateUser);
router.post("/logout", protect, userLogout);
router.get('/profile', protect, userProfile);


module.exports = router;
