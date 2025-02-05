import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext, MdRssFeed } from "react-icons/md"; // Importing new icons
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"; // Importing ShadCN's Card components
import { Link } from "react-router-dom"; // Importing Link for internal routing

const Home = () => {
  const [activeArticle, setActiveArticle] = useState(0);

  const trendingArticles = [
    {
      title: "Forest Conservation Efforts in 2024",
      link: "/article/forest-conservation",
      author: "Jane Doe",
      date: "January 25, 2024",
    },
    {
      title: "The Role of Wetlands in Climate Mitigation",
      link: "/article/wetlands-climate",
      author: "John Smith",
      date: "January 22, 2024",
    },
    {
      title: "Technologies to Combat Deforestation",
      link: "/article/deforestation-tech",
      author: "Emily Brown",
      date: "January 20, 2024",
    },
    {
      title: "Carbon Footprint Reduction Strategies",
      link: "/article/carbon-footprint",
      author: "Michael Green",
      date: "January 18, 2024",
    },
    {
      title: "Sustainable Agriculture Practices for 2024",
      link: "/article/sustainable-agriculture",
      author: "Sarah White",
      date: "January 16, 2024",
    },
    {
      title: "The Future of Renewable Energy",
      link: "/article/renewable-energy",
      author: "David Black",
      date: "January 14, 2024",
    },
  ];

  const featuredArticles = [
    {
      title: "Wildlife Corridors: A Solution for Habitat Fragmentation",
      image: "./pic.jpg",
      link: "/article/wildlife-corridors",
    },
    {
      title: "Urban Development in Sustainable Cities",
      image: "./pic.jpg",
      link: "/article/sustainable-cities",
    },
    {
      title: "Renewable Energy Trends in 2024",
      image: "./pic.jpg",
      link: "/article/renewable-energy",
    },
    {
      title: "The Role of Electric Vehicles in Pollution Control",
      image: "./pic.jpg",
      link: "/article/electric-vehicles",
    },
    {
      title: "The Impact of Green Architecture on Urban Development",
      image: "./pic.jpg",
      link: "/article/green-architecture",
    },
    {
      title: "The Intersection of Climate Change and Technology",
      image: "./pic.jpg",
      link: "/article/climate-tech",
    },
  ];

  const latestArticles = [
    {
      title: "The Importance of Green Roofs in Urban Planning",
      image: "./pic.jpg",
      link: "/article/green-roofs",
      author: "Michael Green",
      date: "January 18, 2024",
    },
    {
      title: "The Impact of Electric Vehicles on Pollution",
      image: "./pic.jpg",
      link: "/article/electric-vehicles",
      author: "Sarah White",
      date: "January 16, 2024",
    },
    {
      title: "How Technology is Helping Combat Climate Change",
      image: "./pic.jpg",
      link: "/article/climate-tech",
      author: "David Black",
      date: "January 14, 2024",
    },
    {
      title: "Sustainable Tourism and Eco-friendly Practices",
      image: "./pic.jpg",
      link: "/article/sustainable-tourism",
      author: "Emily Brown",
      date: "January 12, 2024",
    },
  ];

  const NatureArticles = [
    {
      title: "The Importance of Green Roofs in Urban Planning",
      image: "./pic.jpg",
      link: "/article/green-roofs",
      author: "Michael Green",
      date: "January 18, 2024",
    },
    {
      title: "The Impact of Electric Vehicles on Pollution",
      image: "./pic.jpg",
      link: "/article/electric-vehicles",
      author: "Sarah White",
      date: "January 16, 2024",
    },
    {
      title: "How Technology is Helping Combat Climate Change",
      image: "./pic.jpg",
      link: "/article/climate-tech",
      author: "David Black",
      date: "January 14, 2024",
    },
    {
      title: "Sustainable Tourism and Eco-friendly Practices",
      image: "./pic.jpg",
      link: "/article/sustainable-tourism",
      author: "Emily Brown",
      date: "January 12, 2024",
    },
  ];

  // Function to handle the change of the article for the Featured Section
  const handleNext = () => {
    setActiveArticle((prev) => (prev + 1) % featuredArticles.length);
  };

  const handlePrev = () => {
    setActiveArticle(
      (prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length
    );
  };

  return (
    <div className="container mx-auto px-6 md:px-10 lg:px-20 py-8 mt-2 bg-gray-100 dark:bg-custom-dark">
      {/* Banner Section Top*/}
      <div className="w-full -mt-5 mb-5">
        <img
          src="./whitegreen.png"
          alt="Promotional Banner"
          className="w-full h-auto md:h-32  object-cover rounded-2xl shadow-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-11 gap-5">
        {/* Trending News Section (left section) */}
        <div className="md:col-span-3 bg-white dark:bg-custom-dark rounded-2xl shadow-md p-6 hidden md:block">
          <h2 className="text-lg font-semibold text-gray-800 -mt-2 mb-5 dark:text-gray-100">
            Trending
          </h2>
          <ul className="space-y-6">
            {trendingArticles.slice(0, 6).map((trendingArticles, index) => (
              <Link to={trendingArticles.link} key={index} className="block">
                <Card className="hover:shadow-lg max-w-full transition-transform transform dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black hover:scale-105 hover:bg-custom-green-1">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:underline">
                      {trendingArticles.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-teal-700">
                      {trendingArticles.author}
                    </p>
                    <p className="text-sm font-semibold text-teal-700">
                      {trendingArticles.date}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </ul>
        </div>

        {/* Middle Section (Featured + Latest News) */}
        <div className="md:col-span-6">
          {/* Featured News Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden relative h-[300px] md:h-[400px]">
            <img
              src={featuredArticles[activeArticle].image}
              alt={featuredArticles[activeArticle].title}
              className="w-full h-full object-cover absolute top-0 left-0 rounded-t-2xl transition-all duration-1000 ease-in-out"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50"></div>
            <Link to={featuredArticles[activeArticle].link}>
              <div className="absolute bottom-0 left-0 w-full text-white p-4 mb-2 ml-4 text-left text-xl md:text-3xl font-semibold z-10 hover:underline">
                {featuredArticles[activeArticle].title}
              </div>
            </Link>

            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 md:px-6 transform -translate-y-1/2 z-10">
              <div
                onClick={handlePrev}
                className="text-white cursor-pointer hover:text-custom-green flex items-center justify-center"
              >
                <MdNavigateBefore size={32} />
              </div>
              <div
                onClick={handleNext}
                className="text-white cursor-pointer hover:text-custom-green flex items-center justify-center"
              >
                <MdNavigateNext size={32} />
              </div>
            </div>
          </div>

          {/* Latest News Section */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-1 dark:text-gray-100">
              Latest Articles
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {latestArticles.slice(0, 4).map((latestArticles, index) => (
                <Link to={latestArticles.link} key={index} className="block">
                  <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2 h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black ">
                    {" "}
                    {/* Fixed card height */}
                    <div className="relative h-[150px]">
                      {" "}
                      {/* Fixed image height */}
                      <img
                        src={latestArticles.image}
                        alt={latestArticles.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="mt-1">
                      <CardTitle className="text-lg font-semibold text-gray-800 sm:line-clamp-none md:line-clamp-3 h-[60px] hover:underline dark:text-gray-100">
                        {" "}
                        {/* Line clamping for titles */}
                        {latestArticles.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center -mt-3">
                      <div className="md:flex justify-between w-full">
                        <p className="text-sm font-semibold text-teal-700">
                          {latestArticles.author}
                        </p>
                        <p className="text-sm font-semibold text-teal-700">
                          {latestArticles.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Us Section (right section) */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl shadow-md p-6 h-[300px] md:h-[400px] bg-custom-green-1 dark:bg-custom-dark dark:border-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-100">
              Contact Us
            </h2>
            <p className="text-gray-800 mb-4 dark:text-gray-100">
              Got a story or suggestion? <br /> We'd love to hear from you!
            </p>
            <Link to="/contact">
              <Button
                variant="primary"
                className="w-full rounded-full bg-custom-green text-custom-green-1 transition-transform transform hover:scale-105 mt-10 md:mt-36 font-bold  dark:text-gray-800"
              >
                Contact Us
                <MdNavigateNext size={24} className="ml-2" />
              </Button>
            </Link>
          </div>
          {/* RSS Feed Subscription Section */}
          <div className="rounded-2xl shadow-md p-6 h-[300px] md:h-[300px] bg-custom-green dark:bg-custom-green">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Subscribe</h2>
            <p className="text-gray-200 mb-4">
              Stay updated with our latest articles. <br /> Subscribe to our RSS
              feed now!
            </p>
            <a href="https://rss.com/" target="_blank" rel="noreferrer">
              <Button
                variant="primary"
                className="w-full rounded-full bg-custom-accent-green text-custom-green transition-transform transform hover:scale-105 mt-10 md:mt-31 font-bold dark:text-gray-800"
              >
                Subscribe <MdRssFeed size={24} className="ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="w-full mt-10">
        <img
          src="./Grey Matter.png"
          alt="Promotional Banner"
          className="w-auto h-auto object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* More Articles Section */}
      <div className="flex justify-center items-center">
        <h1 className="text-3xl mt-10 font-semibold text-gray-800 dark:text-gray-100">
          More Articles You’ll Love
        </h1>
      </div>
      {/* Spotlight Articles Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 dark:text-gray-100">Spotlight</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {NatureArticles.slice(0, 4).map((NatureArticles, index) => (
            <Link to={NatureArticles.link} key={index} className="block">
              <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2 h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black ">
                {" "}
                {/* Fixed card height */}
                <div className="relative h-[150px]">
                  {" "}
                  {/* Fixed image height */}
                  <img
                    src={NatureArticles.image}
                    alt={NatureArticles.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="mt-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 sm:line-clamp-none md:line-clamp-3 h-[60px] hover:underline dark:text-gray-100">
                    {" "}
                    {/* Line clamping for titles */}
                    {NatureArticles.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center -mt-3">
                  <div className="md:flex justify-between w-full">
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.author}
                    </p>
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 dark:text-gray-100">
          Environment
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {NatureArticles.slice(0, 4).map((NatureArticles, index) => (
            <Link to={NatureArticles.link} key={index} className="block">
              <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2 h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black ">
                {" "}
                {/* Fixed card height */}
                <div className="relative h-[150px]">
                  {" "}
                  {/* Fixed image height */}
                  <img
                    src={NatureArticles.image}
                    alt={NatureArticles.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="mt-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 sm:line-clamp-none md:line-clamp-3 h-[60px] hover:underline dark:text-gray-100">
                    {" "}
                    {/* Line clamping for titles */}
                    {NatureArticles.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center -mt-3">
                  <div className="md:flex justify-between w-full">
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.author}
                    </p>
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 dark:text-gray-100">
          Sustainable Living
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {NatureArticles.slice(0, 4).map((NatureArticles, index) => (
            <Link to={NatureArticles.link} key={index} className="block">
              <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2 h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black ">
                {" "}
                {/* Fixed card height */}
                <div className="relative h-[150px]">
                  {" "}
                  {/* Fixed image height */}
                  <img
                    src={NatureArticles.image}
                    alt={NatureArticles.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="mt-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 sm:line-clamp-none md:line-clamp-3 h-[60px] hover:underline dark:text-gray-100">
                    {" "}
                    {/* Line clamping for titles */}
                    {NatureArticles.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center -mt-3">
                  <div className=" md:flex justify-between w-full">
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.author}
                    </p>
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 dark:text-gray-100">
          Interviews
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {NatureArticles.slice(0, 4).map((NatureArticles, index) => (
            <Link to={NatureArticles.link} key={index} className="block">
              <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2 h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black ">
                {" "}
                {/* Fixed card height */}
                <div className="relative h-[150px]">
                  {" "}
                  {/* Fixed image height */}
                  <img
                    src={NatureArticles.image}
                    alt={NatureArticles.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="mt-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 sm:line-clamp-none md:line-clamp-3 h-[60px] hover:underline dark:text-gray-100">
                    {" "}
                    {/* Line clamping for titles */}
                    {NatureArticles.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center -mt-3">
                  <div className=" md:flex justify-between w-full">
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.author}
                    </p>
                    <p className="text-sm font-semibold text-teal-700">
                      {NatureArticles.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
