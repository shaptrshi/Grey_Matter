import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const News = () => {
  const articles = [
    {
      id: 1,
      title: "Breaking World News",
      description: "Stay updated with the latest global headlines.",
      image: "./pic.jpg",
      link: "/articles/world-news",
    },
    {
      id: 2,
      title: "Politics and Policies",
      description: "Insights into current political trends and policy changes.",
      image: "./politics.jpg",
      link: "/articles/politics",
    },
    {
      id: 3,
      title: "Business and Economy",
      description: "Updates on the global economy and financial markets.",
      image: "./business.jpg",
      link: "/articles/business",
    },
    {
      id: 4,
      title: "Sports Highlights",
      description: "Catch up on the latest sports events and scores.",
      image: "./sports.jpg",
      link: "/articles/sports",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
          News
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Explore breaking news, updates on politics, business, sports, and more. Stay informed with 
          the latest events shaping our world.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
