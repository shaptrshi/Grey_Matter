const express = require("express");
const router = express.Router();
const { generateRSSFeed } = require("../controller/rssController");

// Define your RSS routes here
router.get("/feed", generateRSSFeed);

module.exports = router;
