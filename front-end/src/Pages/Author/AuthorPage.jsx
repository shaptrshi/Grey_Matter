import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const AuthorPage = () => {
  const [author, setAuthor] = useState({
    name: "Author Name",
    profilePicture: "./pic.jpg", // Add default profile image URL
    bio: "A passionate writer who loves sharing insights on various topics.", // Add author's bio
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Author's Articles</h1>

      {/* Profile Section */}
      <div className="flex items-center mb-4">
        <img
          src={author.profilePicture}
          alt="Author Profile"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-2xl font-semibold">{author.name}</h2>
          <p className="text-gray-600">{author.bio}</p> {/* Display author's bio */}
        </div>
      </div>

      <div className="mb-4">
        <Button
          onClick={handleProfile}
          variant="outline"
          className="text-green-500 border-green-500"
        >
          View Profile
        </Button>
      </div>

      <Button
        onClick={handleCreateArticle}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-6"
      >
        Create New Article
      </Button>

      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              {/* Render Banner Image */}
              <img
                src={article.bannerImage}
                alt={`${article.title} Banner`}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-600">{article.content.slice(0, 100)}...</p>
              <div className="mt-4 flex justify-between">
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
            </Card>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default AuthorPage;
