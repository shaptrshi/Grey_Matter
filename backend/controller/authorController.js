const Author = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Author login
const authorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const authorExist = await Author.findOne({ email });

    if (!authorExist) {
      return res
        .status(400)
        .json({ success: false, message: "Author not found" });
    }

    if (authorExist && (await authorExist.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: authorExist._id,
        email: authorExist.email,
        token: jwt.sign({ _id: authorExist._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid author data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", error });
  }
};

// Author registration
const authorRegister = async (req, res) => {
  
  try {
    const { name, email, password, confirmPassword, bio} = req.body;
    const profilePhoto = req.file ? req.file.path : null;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  const authorExist = await Author.findOne({ email });
  if (authorExist) {
    return res.status(400).json({ success: false, message: "Author already exists" });
  }

  // Remove confirmPassword before saving
  const author = new Author({ name, email, password, bio, profilePhoto });
  delete author.confirmPassword;

  await author.save();

  res.status(201).json({
    success: true,
    _id: author._id,
    name: author.name,
    email: author.email,
    bio: author.bio,
    profilePhoto: author.profilePhoto,
    token: jwt.sign({ _id: author._id }, process.env.JWT_SECRET, { expiresIn: "30d" }),
  });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { authorLogin, authorRegister };
