const RSS = require("rss");
const Article = require("../models/articleModel");

const generateRSSFeed = async (req, res) => {
  try {
    console.log("=== RSS FEED REQUEST START ===");

    const backendUrl = process.env.BASE_URL || "https://api.thatgreymatter.com";
    const frontendUrl = "https://thatgreymatter.com";

    // Create RSS feed
    const feed = new RSS({
      title: "That Grey Matter",
      description: "Latest articles and thoughts",
      feed_url: `${backendUrl}/api/rss/feed`,
      site_url: frontendUrl,
      image_url: `${frontendUrl}/images/logo.png`,
      managingEditor: "editor@thatgreymatter.com",
      webMaster: "admin@thatgreymatter.com",
      copyright: `${new Date().getFullYear()} That Grey Matter`,
      language: "en",
      pubDate: new Date().toISOString(),
      ttl: 60,
    });

    // DEBUG: Check what articles are being fetched
    console.log("Fetching articles from database...");
    
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("author", "name")
      .lean();

    console.log(`✅ Found ${articles.length} total articles in database`);
    
    // Log each article found
    articles.forEach((article, index) => {
      console.log(`📄 Article ${index + 1}:`, {
        id: article._id,
        title: article.title,
        createdAt: article.createdAt,
        author: article.author?.name || 'No author',
        tags: article.tags?.length || 0
      });
    });

    // Check if we have articles
    if (articles.length === 0) {
      console.log("❌ No articles found in database");
      feed.item({
        title: "Welcome to That Grey Matter",
        description: "Stay tuned for upcoming articles and thoughts.",
        url: frontendUrl,
        guid: "welcome-post",
        categories: ["Announcement"],
        author: "Admin",
        date: new Date(),
      });
    } else {
      console.log(`🔄 Adding ${articles.length} articles to RSS feed...`);
      
      // Add articles to RSS feed
      articles.forEach((article, index) => {
        const cleanContent = article.content
          ? article.content.replace(/<[^>]*>/g, "").substring(0, 250)
          : "Read the full article for more details.";

        const articleUrl = `${frontendUrl}/articles/${article._id}`;

        console.log(`➕ Adding to RSS - Article ${index + 1}: "${article.title}"`);

        feed.item({
          title: article.title || "Untitled Article",
          description: cleanContent + "...",
          url: articleUrl,
          guid: article._id.toString(),
          categories: article.tags || ["General"],
          author: article.author?.name || "Unknown Author",
          date: article.createdAt || new Date(),
          enclosure: article.bannerImage ? {
            url: article.bannerImage,
            type: "image/jpeg",
          } : undefined,
        });
      });
    }

    // Set proper headers
    res.set({
      "Content-Type": "application/rss+xml; charset=utf-8",
    });

    const xml = feed.xml({ indent: true });
    console.log(`✅ RSS feed generated successfully with ${articles.length} articles`);
    console.log("=== RSS FEED REQUEST END ===");
    
    res.send(xml);

  } catch (error) {
    console.error("❌ ERROR generating RSS feed:", error);
    console.error("Error stack:", error.stack);
    
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