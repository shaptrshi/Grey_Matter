import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const Weather = () => {
  const articles = [
    {
      id: 1,
      title: "Space Exploration",
      image: "./pic.jpg",
      author: "John Doe",
      date: "January 10, 2025",
      link: "/articles/space",
    },
    {
      id: 2,
      title: "Medical Breakthroughs",
      image: "./medical.jpg",
      author: "Jane Smith",
      date: "February 1, 2025",
      link: "/articles/medical",
    },
    {
      id: 3,
      title: "Physics Discoveries",
      image: "./physics.jpg",
      author: "Richard Feynman",
      date: "March 12, 2025",
      link: "/articles/physics",
    },
    {
      id: 4,
      title: "AI and Robotics",
      image: "./ai-robotics.jpg",
      author: "Elon Musk",
      date: "April 15, 2025",
      link: "/articles/ai-robotics",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-9">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
        Weather
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
        Provide updates, analyses, and trends related to weather patterns and their implications.
        </p>
        <div className="mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {articles.map((article, index) => (
              <Link to={article.link} key={index} className="block">
                <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2 h-[300px]">
                  {/* Fixed card height */}
                  <div className="relative h-[150px]">
                    {/* Fixed image height */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader className="mt-1">
                    <CardTitle className="text-lg font-semibold text-gray-800 sm:line-clamp-none md:line-clamp-3 h-[60px] hover:underline">
                      {/* Line clamping for titles */}
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center -mt-3">
                    <div className="hidden md:flex justify-between w-full">
                      <p className="text-sm font-semibold text-teal-700">
                        {article.author}
                      </p>
                      <p className="text-sm font-semibold text-teal-700">
                        {article.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
