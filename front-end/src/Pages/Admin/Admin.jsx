import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa"; 
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import logo from "../../assets/logo.svg";
import SearchBar from "../../components/searchbar/searchBar";

const Admin = () => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setAuthors([
      {
        id: 1,
        name: "John Doe",
        profilePicture: "./pic.jpg",
        isActive: true,
        articles: [
          {
            id: 101,
            title: "First Article",
            bannerImage: "./pic.jpg",
            link: "/articles/101",
            date: "2021-09-01",
          },
          {
            id: 102,
            title: "Second Article",
            bannerImage: "./pic.jpg",
            link: "/articles/102",
            date: "2021-09-02",
          },
        ],
      },
      {
        id: 2,
        name: "Jane Smith",
        profilePicture: "./pic.jpg",
        isActive: true,
        articles: [
          {
            id: 201,
            title: "Jane's Article",
            bannerImage: "./pic.jpg",
            link: "/articles/201",
            date: "2021-09-03",
          },
          {
            id: 202,
            title: "Another Article",
            bannerImage: "./pic.jpg",
            link: "/articles/202",
            date: "2021-09-04",
          },
        ],
      },
    ]);
  }, []);

  const handleDeleteAuthor = (authorId) => {
    setAuthors((prevAuthors) =>
      prevAuthors.filter((author) => author.id !== authorId)
    );
  };

  const handleDelete = (authorId, articleId) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.id === authorId
          ? {
              ...author,
              articles: author.articles.filter(
                (article) => article.id !== articleId
              ),
            }
          : author
      )
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("token");
      navigate("/signup");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };


  const handleGoToHomePage = () => navigate("/");

  const handleGoToProfilePage = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  return (
    <div className="min-h-screen dark:text-white dark:bg-custom-dark">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 mb-6 shadow-md bg-gray-100 dark:bg-custom-dark dark:shadow-sm dark:shadow-black">
        <div className="pl-4">
          <a href="/">
            <img
              src={logo}
              alt="Logo"
              className="h-8 md:h-12 w-auto transition-transform hover:scale-105"
            />
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <SearchBar className="w-full" />
          </div>

          <TooltipProvider>
            <Tooltip content="Go to Home">
              <Button
                onClick={handleGoToHomePage}
                className="bg-gray-100 dark:bg-custom-dark text-black dark:text-white py-2 px-3 rounded-lg hover:scale-105 dark:hover:bg-blue-600 hover:bg-blue-500 transition-transform"
              >
                <FaHome size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="Log Out">
              <Button
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-custom-dark text-red-700 dark:text-red-500 py-2 px-3 rounded-lg hover:scale-105 dark:hover:bg-red-400 hover:bg-red-300 transition-transform"
              >
                <FaSignOutAlt size={24} />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-10 py-2 bg-gray-100 dark:bg-custom-dark">
        {/* Authors & Articles */}
        {authors
          .filter(
            (author) =>
              author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              author.articles.some((article) =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
          )
          .map((author) => (
            <div key={author.id} className="mb-10">
              <div className="flex items-center space-x-4">
                <img
                  src={author.profilePicture}
                  alt={author.name}
                  className="w-16 h-16 rounded-full"
                />
                <h2 className="text-xl font-semibold">{author.name}</h2>

                {/* Author Actions */}
                <div className="ml-auto space-x-3">
                  <Button
                    onClick={() => handleGoToProfilePage(author.id)}
                    className="text-gray-800 dark:text-white dark:bg-custom-dark bg-gray-100 px-3 rounded-lg hover:bg-blue-400 dark:hover:bg-blue-600 shadow-none"
                  >
                    <FaUser size={24} />
                  </Button>

                  <Button
                    onClick={() => handleDeleteAuthor(author.id)}
                    className="text-red-700  dark:text-red-600 py-1 dark:bg-custom-dark bg-gray-100 px-3 rounded-lg dark:hover:bg-red-400 hover:bg-red-300 hover:text-gray-800 shadow-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Articles */}
              <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {author.articles.map((article) => (
                    <Link to={article.link} key={article.id} className="block">
                      <Card className="hover:shadow-md transition-transform transform hover:scale-105 p-2 h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black">
                        {/* Fixed card height */}
                        <div className="relative h-[150px] sm:h-[150px]">
                          <img
                            src={article.bannerImage}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                          />
                        </div>
                        <CardHeader className="p-3 sm:p-4 mt-1">
                          <CardTitle className="text-lg sm:text-lg font-semibold text-gray-800 line-clamp-2 hover:underline dark:text-gray-100">
                            {article.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 -mt-2">
                          <p className="font-semibold text-teal-700">
                            {article.date}
                          </p>
                          <div className="flex justify-end gap-4 mt-2">
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(article.id);
                              }}
                              variant="destructive"
                              size="sm"
                              className="dark:text-white dark:bg-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Admin;
