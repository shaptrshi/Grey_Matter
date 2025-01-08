import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BlogCards = () => {
  const articles = [
    {
      title: "Dark Oxygen: A Groundbreaking Discovery in the Deep Ocean",
      categories: ["Featured", "Science"],
      image:
        "https://indianyug.com/wp-content/uploads/2024/07/Dark-Oxygen-A-Groundbreaking-Discovery-in-the-Deep-Ocean-1110x720.jpg.webp",
      alt: "Deep ocean scene with blue lighting",
    },
    {
      title:
        "Indian Gov to Send Notice to Google Regarding Alleged 'Illegal' Response by its AI",
      categories: ["Featured", "News", "Politics", "Technology"],
      image:
        "https://indianyug.com/wp-content/uploads/2024/02/Indian-Gov-to-Send-Notice-to-Google-Regarding-Alleged-Illegal-Response-by-its-AI-Gemini-to-Question-on-PM-Modi-400x450.jpeg.webp",
      alt: "AI concept illustration",
    },
    {
      title: "Astronomers Find Possibly the Brightest Thing in Universe",
      categories: ["Featured", "Science"],
      image:
        "https://indianyug.com/wp-content/uploads/2024/02/Astronomers-Find-Possibly-the-Brightest-Thing-in-Universe-With-a-Black-Hole-Eating-a-Sun-Everyday-400x450.jpeg.webp",
      alt: "Black hole visualization",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {articles.map((article, index) => (
        <Card
          key={index}
          className="overflow-hidden group cursor-pointer transition-transform hover:scale-105 hover:shadow-sm duration-300 hover:shadow-gray-400"
        >
          <div className="relative">
            <img
              src={article.image}
              alt={article.alt}
              className="w-full h-60 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="space-x-2 mb-2">
                {article.categories.map((category, catIndex) => (
                  <Badge
                    key={catIndex}
                    variant="secondary"
                    className="bg-black/50 text-white hover:bg-black/60"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <h2 className="text-lg font-bold text-white">{article.title}</h2>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BlogCards;
