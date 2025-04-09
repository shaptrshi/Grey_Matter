const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");
const {
    userLogin,
    userRegister,
    updateUser,
    userLogout,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");


router.post("/login", userLogin); // User login
router.post("/register", upload.single("profilePhoto"), userRegister); // User registration
router.put("/update", protect, upload.single("profilePhoto"), updateUser); // Update user profile
router.get("/logout", protect, userLogout); // User logout

module.exports = router;