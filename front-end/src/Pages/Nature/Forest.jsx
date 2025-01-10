import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader,CardContent } from "@/components/ui/card";


const Forest = () => {
  const articles = [
    {
      id: 1,
      title: "Protecting Our Forests",
      description: "Discover the latest efforts to preserve forests worldwide.",
      image: "./forest.jpg",
      link: "/articles/forests",
    },
    {
      id: 2,
      title: "Marine Life Conservation",
      description: "How we can save our oceans and marine biodiversity.",
      image: "./marine-life.jpg",
      link: "/articles/marine-life",
    },
    {
      id: 3,
      title: "Climate Change Solutions",
      description: "Innovative solutions to combat climate change.",
      image: "./climate-change.jpg",
      link: "/articles/climate-change",
    },
    {
      id: 4,
      title: "Urban Green Spaces",
      description: "The importance of parks and greenery in cities.",
      image: "./urban-green.jpg",
      link: "/articles/urban-green",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
          Forest
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
        Explore a curated collection of articles on environmental awareness and sustainable living,
        covering topics like forest conservation and innovative climate change solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-sm duration-300 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-gray-400"
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

export default Forest;
