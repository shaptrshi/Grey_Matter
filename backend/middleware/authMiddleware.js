const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

const protect = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token format.",
    });
  }

  const tokenWithoutBearer = token.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. Token has expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. Invalid token." });
    } else {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
};

module.exports = { protect };
