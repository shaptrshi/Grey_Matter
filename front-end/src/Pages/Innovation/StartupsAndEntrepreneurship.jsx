import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const StartupsAndEntrepreneurship = () => {
  const articles = [
    {
      id: 1,
      title: "Latest Gadgets",
      description: "Get insights into the newest gadgets and innovations.",
      image: "./pic.jpg",
      link: "/articles/gadgets",
    },
    {
      id: 2,
      title: "Blockchain Technology",
      description: "Exploring the potential and challenges of blockchain.",
      image: "./blockchain.jpg",
      link: "/articles/blockchain",
    },
    {
      id: 3,
      title: "Cloud Computing",
      description: "The future of data storage and processing in the cloud.",
      image: "./cloud-computing.jpg",
      link: "/articles/cloud-computing",
    },
    {
      id: 4,
      title: "Cybersecurity Trends",
      description: "Protecting data in an increasingly digital world.",
      image: "./cybersecurity.jpg",
      link: "/articles/cybersecurity",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
        Startups And Entrepreneurship
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Eco-Friendly lifestyles and sustainable living.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default StartupsAndEntrepreneurship;
