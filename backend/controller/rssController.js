const generateRSSFeed = async (req, res) => {
  try {
    console.log("RSS Feed requested");

    const backendUrl = process.env.BASE_URL || "https://api.thatgreymatter.com";
    const frontendUrl = "https://thatgreymatter.com";

    console.log("Backend URL:", backendUrl);
    console.log("Frontend URL:", frontendUrl);

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
      categories: ["Blog", "Articles", "Thoughts"],
      pubDate: new Date().toISOString(),
      ttl: 60,
      generator: "That Grey Matter RSS Generator",
    });

    // Get latest articles
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("author", "name")
      .lean();

    console.log(`Found ${articles.length} articles for RSS feed`);

    if (articles.length === 0) {
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
      articles.forEach((article, index) => {
        const cleanContent = article.content
          ? article.content.replace(/<[^>]*>/g, "").substring(0, 250)
          : "Read the full article for more details.";

        const articleUrl = `${frontendUrl}/articles/${article._id}`;

        console.log(`Adding article ${index + 1}:`, article.title);
        console.log(`Article URL:`, articleUrl);

        feed.item({
          title: article.title || "Untitled Article",
          description: cleanContent + "...",
          url: articleUrl,
          guid: article._id.toString(),
          categories: article.tags && article.tags.length > 0 ? article.tags : ["General"],
          author: article.author?.name || "Unknown Author",
          date: article.createdAt || new Date(),
          enclosure: article.bannerImage ? {
            url: article.bannerImage.startsWith('http') 
              ? article.bannerImage 
              : `${frontendUrl}${article.bannerImage}`,
            type: "image/jpeg",
          } : undefined,
        });
      });
    }

    // Set proper headers
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