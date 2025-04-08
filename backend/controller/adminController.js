const Admin = require("../models/adminModel");
const Author = require("../models/authorModel");
const Article = require("../models/articleModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const dotenv = require("dotenv");

dotenv.config();

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const adminExist = await Admin.findOne({ email });
    
    if (!adminExist) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found" });
    }


    if (adminExist && (await adminExist.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: adminExist._id,
        email: adminExist.email,
        token: jwt.sign({ _id: adminExist._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", error });
  }
};

const adminRegister = async (req, res) => {
  const {name,email, password, confirmPassword } = req.body;


  try {
    if (!email || !password || !confirmPassword || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" }); // Check if passwords match
    }

    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const admin = new Admin({ name,email, password });
    await admin.save();

    if (admin) {
      res.status(201).json({
        success: true,
        _id: admin._id,
        email: admin.email,
        token: jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      res.status(401);
      throw new Error("Invalid admin data");
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Logging Out" });
  }
};  

// Delete an Author
const deleteAuthor = async (req, res) => {
  const {authorId} = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ success: false, message: "Invalid author ID" });
    }

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }

    await Article.deleteMany({author: authorId});

    await author.deleteOne();

    res.status(200).json({ success: true, message: "Author deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Edit Author Article
const updateAuthorArticle = async (req, res) => {
  const { articleId } = req.params;
  const { title, content, bannerImage, tags, isFeatured } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ success: false, message: "Invalid article ID" });
    }

    const updateArticle = await Article.findByIdAndUpdate(
      articleId,
      { title, content, bannerImage, tags, isFeatured },
      { new: true, runValidators: true }
    );

    if (!updateArticle) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    res.status(200).json({ 
      success: true,
      message: "Article updated successfully",
      article: updateArticle,
     });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Author Article
const deleteAuthorArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ success: false, message: "Invalid article ID" });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    await Author.findByIdAndUpdate(article.author, { $pull: { articles: article._id } });

    await article.deleteOne();

    res.status(200).json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { adminLogin, adminRegister, adminLogout, deleteAuthor, updateAuthorArticle, deleteAuthorArticle };