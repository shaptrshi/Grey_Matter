const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
