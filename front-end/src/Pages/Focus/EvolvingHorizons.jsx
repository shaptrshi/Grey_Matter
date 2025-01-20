import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const EvolvingHorizons = () => {
  const articles = [
    {
      id: 1,
      title: "Space Exploration",
      description: "Discover the latest missions and findings in space exploration.",
      image: "./space.jpg",
      link: "/articles/space",
    },
    {
      id: 2,
      title: "Medical Breakthroughs",
      description: "Advancements in healthcare and medical technology.",
      image: "./medical.jpg",
      link: "/articles/medical",
    },
    {
      id: 3,
      title: "Physics Discoveries",
      description: "Learn about groundbreaking discoveries in physics.",
      image: "./physics.jpg",
      link: "/articles/physics",
    },
    {
      id: 4,
      title: "AI and Robotics",
      description: "The intersection of artificial intelligence and robotics.",
      image: "./ai-robotics.jpg",
      link: "/articles/ai-robotics",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
        Evolving Horizons
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Dive into the world of science with articles on space, medical advancements, 
          physics discoveries, and cutting-edge technology.
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

export default EvolvingHorizons;
