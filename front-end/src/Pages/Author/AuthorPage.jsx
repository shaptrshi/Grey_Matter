import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AuthorPage = () => {
  const [author, setAuthor] = useState({
    name: "John Doe", // Author's name
    profilePicture: "./pic.jpg", // Default profile image URL
    bio: "A passionate writer who loves sharing insights on various topics.", // Author's bio
  });

  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "First Article",
      content: "This is the first article",
      bannerImage: "./pic.jpg",
    },
    {
      id: 2,
      title: "Second Article",
      content: "This is the second article",
      bannerImage: "./pic.jpg",
    },
    {
      id: 3,
      title: "Third Article",
      content: "This is the third article",
      bannerImage: "./pic.jpg",
    },
    {
      id: 4,
      title: "Fourth Article",
      content: "This is the fourth article",
      bannerImage: "./pic.jpg",
    },
  ]);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    setArticles(articles.filter((article) => article.id !== id));
  };

  const handleEdit = (id) => {
    navigate(`/edit-article/${id}`);
  };

  const handleCreateArticle = () => {
    navigate("/create-article");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/signup");
  };

  const handleGoToHomePage = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4">
      {/* Top Section */}
      <div className="flex justify-between items-center px-1 py-1 mb-3">
        <h1 className="text-3xl font-bold">John Doe's</h1>
        <div className="flex space-x-4">
          <Button
            onClick={handleGoToHomePage}
            className="bg-gray-100 text-black py-2 px-3 rounded-lg transiton-transform hover:scale-105 hover:bg-blue-400"
          >
             <FaHome size={20} />
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-gray-100 text-black py-2 px-3 rounded-lg transition-transform hover:scale-105 hover:bg-red-400"
          >
            <FaSignOutAlt size={30} />
          </Button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex flex-col items-center">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-2 bg-gray-100 p-4 w-full max-w-3xl">
          <img
            src={author.profilePicture}
            alt="Author Profile"
            className="w-40 h-40 rounded-full mb-3 object-cover"
          />
          <h2 className="text-2xl font-semibold">{author.name}</h2>
          <p className="text-gray-600 text-center">{author.bio}</p>
        </div>

        {/* Buttons Section */}
        <div className="flex space-x-4 mb-4">
          <Button
            onClick={handleProfile}
            className="text-white bg-gray-600 py-1 px-4 rounded-lg transition-transform hover:scale-105 hover:bg-gray-700"
          >
            View Profile
          </Button>
          <Button
            onClick={handleCreateArticle}
            className="bg-blue-500 text-white py-1 px-4 rounded-lg transition-transform hover:scale-105 hover:bg-blue-600"
          >
            Create Article
          </Button>
        </div>

        {/* Articles Section */}
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full justify-items-center">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-sm duration-300 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-custom-green"
              >
                <img
                  src={article.bannerImage}
                  alt={`${article.title} Banner`}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-sm text-gray-600">
                  {article.content.slice(0, 100)}...
                </p>
                <div className="mt-4 flex justify-between">
                  <Tooltip content="Edit Article">
                    <Button
                      onClick={() => handleEdit(article.id)}
                      variant="link"
                      className="text-blue-500 hover:underline transition-transform transform hover:scale-105"
                    >
                      Edit
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete Article">
                    <Button
                      onClick={() => handleDelete(article.id)}
                      variant="link"
                      className="text-red-500 hover:underline transition-transform transform hover:scale-105"
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </div>
              </Card>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AuthorPage;
