import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FaHome, FaUser, FaPlusCircle, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { Search } from "lucide-react";

const AuthorPage = () => {
  const [author, setAuthor] = useState({
    name: "John Doe",
    profilePicture: "./pic.jpg",
  });

  const [articles, setArticles] = useState([
    { id: 1, title: "First Article", content: "This is the first article", bannerImage: "./pic.jpg" },
    { id: 2, title: "Second Article", content: "This is the second article", bannerImage: "./pic.jpg" },
    { id: 3, title: "Third Article", content: "This is the third article", bannerImage: "./pic.jpg" },
    { id: 4, title: "Fourth Article", content: "This is the fourth article", bannerImage: "./pic.jpg" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleDelete = (id) => setArticles(articles.filter((a) => a.id !== id));
  const handleEdit = (id) => navigate(`/edit-article/${id}`);
  const handleCreateArticle = () => navigate("/create-article");
  const handleProfile = () => navigate("/profile");
  const handleLogout = () => navigate("/signup");
  const handleGoToHomePage = () => navigate("/");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Top Section */}
      <div className="flex justify-between items-center px-1 py-3 mb-6 shadow-md bg-white">
        <h1 className="text-3xl font-bold pl-4">{`${author.name}'s Page`}</h1>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <div className="w-full flex items-center bg-gray-100 rounded-lg hover:bg-custom-green-1 transition-colors duration-200">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent py-2 px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Buttons with Icons */}
          <TooltipProvider>
            <Tooltip content="Go to Home">
              <Button
                onClick={handleGoToHomePage}
                className="bg-gray-100 text-black py-2 px-3 rounded-lg transition-transform hover:scale-105 hover:bg-blue-500"
              >
                <FaHome size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="View Profile">
              <Button
                onClick={handleProfile}
                className="bg-gray-100 text-black py-1 px-3 rounded-lg transition-transform hover:scale-105 hover:bg-gray-400"
              >
                <FaUser size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="Log Out">
              <Button
                onClick={handleLogout}
                className="bg-gray-100 text-red-700 py-2 px-3 rounded-lg transition-transform hover:scale-105 hover:bg-red-300"
              >
                <FaSignOutAlt size={24} />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-2 -mt-4">
        {/* Profile Section */}
        <div className="flex items-center mb-6 space-y-4 relative">
          <div className="bg-gray-100 p-4 w-full max-w-3xl rounded-lg flex items-center">
            <img
              src={author.profilePicture}
              alt="Author Profile"
              className="w-32 h-32 rounded-full object-cover mr-6"
            />
            <div>
              <h2 className="text-3xl font-semibold">{author.name}</h2>
            </div>

            {/* Create Article Button */}
            <div>
              {/* For Larger Screens */}
              <div className="hidden md:block absolute top-4 right-4">
                <TooltipProvider>
                  <Tooltip content="Create Article">
                    <Button
                      onClick={handleCreateArticle}
                      className="bg-gray-100 text-black py-1 px-3 rounded-lg transition-transform hover:scale-110 hover:bg-blue-400 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md"
                    >
                      Create Article <FaPlusCircle size={100} />
                    </Button>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* For Mobile Screens */}
              <div className="md:hidden fixed bottom-6 right-6 z-50">
                <TooltipProvider>
                  <Tooltip content="Create Article">
                    <button
                      onClick={handleCreateArticle}
                      className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-transform hover:scale-110"
                    >
                      <FaPlus size={24} />
                    </button>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="shadow-md hover:shadow-lg transition-transform hover:scale-105 border border-gray-200"
              >
                {/* Banner Image */}
                <CardHeader className="p-0">
                  <img
                    src={article.bannerImage}
                    alt={`${article.title} Banner`}
                    className="w-full h-40 object-cover rounded-t-md"
                  />
                </CardHeader>

                {/* Article Content */}
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold mb-2">{article.title}</CardTitle>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {article.content.slice(0, 100)}
                  </p>
                </CardContent>

                {/* Edit & Delete Buttons */}
                <CardFooter className="flex justify-between items-center p-4 pt-0">
                  {/* Edit Button */}
                  <Tooltip content="Edit Article">
                    <Button
                      onClick={() => handleEdit(article.id)}
                      variant="ghost"
                      className="text-blue-500 hover:bg-blue-400 text-sm"
                    >
                      Edit
                    </Button>
                  </Tooltip>

                  {/* Delete Button */}
                  <Tooltip content="Delete Article">
                    <Button
                      onClick={() => handleDelete(article.id)}
                      variant="ghost"
                      className="text-red-500 hover:bg-red-400 text-sm"
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AuthorPage;
