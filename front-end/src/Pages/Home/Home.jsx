import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md"; // Importing new icons
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"; // Importing ShadCN's Card components
import { Link } from "react-router-dom"; // Importing Link for internal routing

const Home = () => {
  const [activeArticle, setActiveArticle] = useState(0);

  const articles = [
    {
      title: "Forest Conservation Efforts in 2024",
      image: "./pic.jpg",
      link: "/article/forest-conservation", // Link to the article page
      author: "Jane Doe",
      date: "January 25, 2024",
    },
    {
      title: "The Role of Wetlands in Climate Mitigation",
      image: "./pic.jpg",
      link: "/article/wetlands-climate", // Link to the article page
      author: "John Smith",
      date: "January 22, 2024",
    },
    {
      title: "Wildlife Corridors: A Solution for Habitat Fragmentation",
      image: "./pic.jpg",
      link: "/article/wildlife-corridors", // Link to the article page
      author: "Emily Brown",
      date: "January 20, 2024",
    },
    {
      title: "Sustainable Cities and Urban Development",
      image: "./pic.jpg",
      link: "/article/sustainable-cities", // Link to the article page
      author: "Michael Green",
      date: "January 18, 2024",
    },
    {
      title: "Sustainable Cities and Urban Development",
      image: "./pic.jpg",
      link: "/article/sustainable-cities", // Link to the article page
      author: "Michael Green",
      date: "January 18, 2024",
    },
    {
      title: "Sustainable Cities and Urban Development",
      image: "./pic.jpg",
      link: "/article/sustainable-cities", // Link to the article page
      author: "Michael Green",
      date: "January 18, 2024",
    },
  ];

  // Function to handle the change of the article for the Featured Section
  const handleNext = () => {
    setActiveArticle((prev) => (prev + 1) % articles.length);
  };

  const handlePrev = () => {
    setActiveArticle((prev) => (prev - 1 + articles.length) % articles.length);
  };

  return (
    <div className="container mx-auto px-6 md:px-10 lg:px-20 py-10 mt-2 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-11 gap-5">
        {/* Trending News Section (left section) */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-6 hidden md:block">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Trending</h2>
          <ul className="space-y-4">
            {articles.map((article, index) => (
              <Link to={article.link} key={index} className="block">
                <Card className="hover:shadow-lg max-w-full transition-transform transform hover:scale-105 hover:bg-custom-green-1">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-teal-700">{article.author}</p>
                    <p className="text-sm font-semibold text-teal-700">{article.date}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </ul>
        </div>

        {/* Middle Section (Featured + Latest News) */}
        <div className="md:col-span-6">
          {/* Featured News Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative h-[300px] md:h-[400px]">
            <Link to={articles[activeArticle].link} className="relative block w-full h-full">
              <img
                src={articles[activeArticle].image}
                alt={articles[activeArticle].title}
                className="w-full h-full object-cover absolute top-0 left-0 rounded-t-2xl transition-all duration-1000 ease-in-out"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50"></div>

              <div className="absolute bottom-0 left-0 w-full text-white p-4 text-left text-xl md:text-3xl font-semibold z-10">
                {articles[activeArticle].title}
              </div>
            </Link>

            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 md:px-6 transform -translate-y-1/2 z-10">
              <div
                onClick={handlePrev}
                className="text-white cursor-pointer hover:text-custom-green flex items-center justify-center"
              >
                <MdNavigateBefore size={32} md:size={42} />
              </div>
              <div
                onClick={handleNext}
                className="text-white cursor-pointer hover:text-custom-green flex items-center justify-center"
              >
                <MdNavigateNext size={32} md:size={42} />
              </div>
            </div>
          </div>

         {/* Latest News Section */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Latest News</h2>
            <div className="grid grid-cols-2 gap-4">
              {articles.slice(0, 4).map((article, index) => (
                <Link to={article.link} key={index} className="block">
                  <Card className="hover:shadow-lg max-w-full transition-transform transform hover:scale-105 p-2 h-[300px]"> {/* Fixed card height */}
                    <div className="relative h-[150px]"> {/* Fixed image height */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="mt-2">
                      <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2 h-[50px]"> {/* Line clamping for titles */}
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center -mt-2">
                      <p className="text-sm font-semibold text-teal-700">{article.author}</p>
                      <p className="text-sm font-semibold text-teal-700">{article.date}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Us Section (right section) */}
        <div className="md:col-span-2 rounded-2xl shadow-lg p-6 h-[300px] md:h-[400px] bg-custom-green-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-800 mb-4">Got a story or suggestion? <br /> We'd love to hear from you!</p>
          <Link to="/contact">
            <Button
              variant="primary"
              className="w-full rounded-full bg-custom-green text-custom-green-1 transition-transform transform hover:scale-105 mt-10 md:mt-36"
            >
              Contact Us
              <MdNavigateNext size={24} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
