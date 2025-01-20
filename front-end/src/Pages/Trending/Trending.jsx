import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const Trending = () => {
  const featuredArticles = [
    {
      id: 1,
      title: "Protecting Our Forests",
      description: "Discover the latest efforts to preserve forests worldwide.",
      image: "forest.jpg",
      link: "/articles/forests",
      category: "Environment",
    },
    {
      id: 2,
      title: "Breaking World News",
      description: "Stay updated with the latest global headlines.",
      image: "world-news.jpg",
      link: "/articles/world-news",
      category: "News",
    },
    {
      id: 3,
      title: "Space Exploration",
      description:
        "Discover the latest missions and findings in space exploration.",
      image: "./space.jpg",
      link: "/articles/space",
      category: "Science",
    },
    {
      id: 4,
      title: "Latest Gadgets",
      description: "Get insights into the newest gadgets and innovations.",
      image: "./gadgets.jpg",
      link: "/articles/gadgets",
      category: "Technology",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
          Trending
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          A handpicked selection of standout articles from Environment, News,
          Science, and Technology. Explore the best insights across various
          fields.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArticles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-md duration-300 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-custom-green"
            >
              <CardHeader className="p-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-md"
                />
              </CardHeader>
              <CardContent>
                <h2 className="text-xl font-semibold text-foreground">
                  {article.title}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {article.description}
                </p>
                <p className="mt-2 text-sm text-primary font-medium">
                  Category: {article.category}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
