import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AuthorPage = () => {
  const [author, setAuthor] = useState({
    name: "John Doe",
    profilePicture: "./pic.jpg",
    bio: "A passionate writer who loves sharing insights on various topics.",
  });

  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "First Article",
      content: "This is the first article",
      bannerImage: "./pic.jpg", // Article image
    },
    {
      id: 2,
      title: "Second Article",
      content: "This is the second article",
      bannerImage: "./article2.jpg",
    },
    {
      id: 3,
      title: "Third Article",
      content: "This is the third article",
      bannerImage: "./article3.jpg",
    },
    {
      id: 4,
      title: "Fourth Article",
      content: "This is the fourth article",
      bannerImage: "./article4.jpg",
    },
  ]);

  const navigate = useNavigate();

  const handleDelete = (id) => setArticles(articles.filter((a) => a.id !== id));
  const handleEdit = (id) => navigate(`/edit-article/${id}`);
  const handleCreateArticle = () => navigate("/create-article");
  const handleProfile = () => navigate("/profile");
  const handleLogout = () => navigate("/signup");
  const handleGoToHomePage = () => navigate("/");

  return (
    <div className="container mx-auto p-4">
      {/* Top Section */}
      <div className="flex justify-between items-center px-1 py-1 mb-3">
        <h1 className="text-3xl font-bold">{`${author.name}'s Articles`}</h1>
        <div className="flex space-x-4">
          <Button
            onClick={handleGoToHomePage}
            className="bg-gray-100 text-black py-2 px-3 rounded-lg transition-transform hover:scale-105 hover:bg-blue-400"
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

     {/* Profile Section */}
      <div className="flex flex-col items-center mb-3 space-y-4">
        <div className="flex flex-col items-center bg-gray-100 p-4 w-full max-w-3xl">
          <img
            src={author.profilePicture}
            alt="Author Profile"
            className="w-40 h-40 rounded-full mb-3 object-cover"
          />
          <h2 className="text-2xl font-semibold">{author.name}</h2>
          <p className="text-gray-600 text-center">{author.bio}</p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
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
      </div>


      {/* Articles Section */}
      <TooltipProvider>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-sm duration-200 transition-transform hover:scale-105 hover:shadow-custom-green"
            >
              <img
                src={article.bannerImage}
                alt={`${article.title} Banner`}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.content.slice(0, 100)}</p>
              <div className="flex justify-between">
                <Tooltip content="Edit Article">
                  <Button
                    onClick={() => handleEdit(article.id)}
                    variant="link"
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip content="Delete Article">
                  <Button
                    onClick={() => handleDelete(article.id)}
                    variant="link"
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </Button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default AuthorPage;
