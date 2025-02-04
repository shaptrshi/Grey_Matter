import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FaHome, FaUser, FaPlusCircle, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { Search } from "lucide-react";

const AuthorPage = () => {
  const [author, setAuthor] = useState({
    name: "John Doe",
    profilePicture: "./pic.jpg",
    articles: [
      { id: 1, title: "First Article", bannerImage: "./pic.jpg", link: "/article/1" },
      { id: 2, title: "Second Article", bannerImage: "./pic.jpg", link: "/article/2" },
      { id: 3, title: "Third Article", bannerImage: "./pic.jpg", link: "/article/3" },
      { id: 4, title: "Fourth Article", bannerImage: "./pic.jpg", link: "/article/4" },
    ],
  });

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const handleDelete = (id) => setAuthor((prev) => ({
    ...prev,
    articles: prev.articles.filter((article) => article.id !== id),
  }));
  const handleEdit = (id) => navigate(`/edit-article/${id}`);
  const handleCreateArticle = () => navigate("/create-article");
  const handleProfile = () => navigate("/profile");
  const handleLogout = () => navigate("/signup");
  const handleGoToHomePage = () => navigate("/");

  const filteredArticles = author.articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 mb-6 shadow-md bg-gray-100">
        <div className="pl-4">
          <a href="/">
            <img src="./logo2.png" alt="Logo" className="h-8 md:h-12 w-auto hover:scale-105 transition-transform" />
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <div className="w-full flex items-center bg-gray-100 rounded-lg hover:bg-custom-green-1 transition-colors">
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

          {/* Navigation Buttons */}
          <TooltipProvider>
            <Tooltip content="Go to Home">
              <Button onClick={handleGoToHomePage} className="bg-gray-100 text-black py-2 px-3 rounded-lg hover:scale-105 hover:bg-blue-500">
                <FaHome size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="View Profile">
              <Button onClick={handleProfile} className="bg-gray-100 text-black py-1 px-3 rounded-lg hover:scale-105 hover:bg-gray-400">
                <FaUser size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="Log Out">
              <Button onClick={handleLogout} className="bg-gray-100 text-red-700 py-2 px-3 rounded-lg hover:scale-105 hover:bg-red-300">
                <FaSignOutAlt size={24} />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-10 py-5 -mt-4 bg-gray-100">
        {/* Profile Section */}
        <div className="flex items-center mb-6 space-y-4 relative">
          <div className="bg-gray-100 p-4 w-full max-w-3xl rounded-lg flex items-center">
            <img src={author.profilePicture} alt="Author Profile" className="w-32 h-32 rounded-full object-cover mr-6" />
            <div>
              <h2 className="text-3xl font-semibold">{author.name}</h2>
            </div>

            {/* Create Article Button */}
            <div>
              {/* For Larger Screens */}
              <div className="hidden md:block absolute top-4 right-4">
                <TooltipProvider>
                  <Tooltip content="Create Article">
                    <Button onClick={handleCreateArticle} className="bg-gray-100 text-black py-1 px-3 rounded-lg hover:scale-110 hover:bg-blue-400">
                      Create Article <FaPlusCircle size={100} />
                    </Button>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* For Mobile Screens */}
              <div className="md:hidden fixed bottom-6 right-6 z-50">
                <TooltipProvider>
                  <Tooltip content="Create Article">
                    <button onClick={handleCreateArticle} className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:scale-110">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {filteredArticles.map((article) => (
              <Link to={article.link} key={article.id} className="block">
                <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2">
                  <CardHeader className="p-0">
                    <img src={article.bannerImage} alt={article.title} className="w-full h-40 object-cover rounded-t-md" />
                  </CardHeader>
                  <CardContent className="p-3">
                    <CardTitle className="text-lg font-semibold mb-2 text-gray-800 hover:underline">
                      {article.title}
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4">
                    <Button onClick={() => handleEdit(article.id)} variant="ghost" className="text-blue-500 hover:bg-blue-400 hover:text-gray-800">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(article.id)} variant="ghost" className="text-red-500 hover:bg-red-400 hover:text-gray-800">
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AuthorPage;
