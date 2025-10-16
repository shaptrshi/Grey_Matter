const Article = require("../models/articleModel");
const RSS = require("rss");

const generateRSSFeed = async (req, res) => {
  try {
    console.log("RSS Feed requested");

    // Create proper base URL - fix the undefined issue
    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    console.log("Base URL for RSS:", baseUrl);

    const feed = new RSS({
      title: "EcoBlog - Sustainable Living",
      description:
        "Latest articles about environment, sustainable living, and eco-friendly tips",
      feed_url: `${baseUrl}/api/rss/feed`,
      site_url: baseUrl,
      image_url: `${baseUrl}/images/logo.png`, // Fixed undefined issue
      managingEditor: "editor@ecoblog.com",
      webMaster: "admin@ecoblog.com",
      copyright: `${new Date().getFullYear()} EcoBlog`,
      language: "en",
      categories: ["Environment", "Sustainable Living", "Eco-friendly"],
      pubDate: new Date().toISOString(),
      ttl: 60,
      generator: "EcoBlog RSS Generator",
    });

    // Get latest articles
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("author", "name")
      .lean();

    console.log(`Found ${articles.length} articles for RSS feed`);

    if (articles.length === 0) {
      // Add a default item if no articles exist
      feed.item({
        title: "Welcome to Our Blog",
        description:
          "Stay tuned for upcoming articles about sustainable living and environmental topics.",
        url: baseUrl,
        guid: "welcome-post",
        categories: ["Announcement"],
        author: "Admin",
        date: new Date(),
      });
    } else {
      // Add articles to RSS feed
      articles.forEach((article, index) => {
        // Create a clean description (strip HTML tags)
        const cleanContent = article.content
          ? article.content.replace(/<[^>]*>/g, "").substring(0, 250)
          : "Read the full article for more details.";

        // Build proper article URL
        const articleUrl = `${baseUrl}/api/articles/${article._id}`;

        console.log(`Adding article ${index + 1}:`, article.title);
        console.log(`Article URL:`, articleUrl);

        feed.item({
          title: article.title || "Untitled Article",
          description: cleanContent + "...",
          url: articleUrl, // Fixed undefined issue
          guid: article._id.toString(),
          categories:
            article.tags && article.tags.length > 0
              ? article.tags
              : ["General"],
          author: article.author?.name || "Unknown Author",
          date: article.createdAt || new Date(),
          enclosure: article.bannerImage
            ? {
                url: article.bannerImage,
                type: "image/jpeg",
              }
            : undefined,
        });
      });
    }

    // Set proper headers for RSS
    res.set({
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    });

    const xml = feed.xml({ indent: true });
    console.log("RSS feed generated successfully");
    res.send(xml);
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    res.set("Content-Type", "application/xml");
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Error generating RSS feed</message>
  <details>${error.message}</details>
</error>`);
  }
};

module.exports = {
  generateRSSFeed,
};
