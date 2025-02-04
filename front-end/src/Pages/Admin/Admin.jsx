import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa"; // Import FaUser icon
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

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
          { id: 101, title: "First Article", bannerImage: "./pic.jpg", link: "/articles/101" },
          { id: 102, title: "Second Article", bannerImage: "./pic.jpg", link: "/articles/102" },
        ],
      },
      {
        id: 2,
        name: "Jane Smith",
        profilePicture: "./pic.jpg",
        isActive: true,
        articles: [
          { id: 201, title: "Jane's Article", bannerImage: "./pic.jpg", link: "/articles/201" },
        ],
      },
    ]);
  }, []);

  const handleDeleteAuthor = (authorId) => {
    setAuthors((prevAuthors) => prevAuthors.filter((author) => author.id !== authorId));
  };

  const handleDelete = (authorId, articleId) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.id === authorId
          ? { ...author, articles: author.articles.filter((article) => article.id !== articleId) }
          : author
      )
    );
  };

  const handleEdit = (id) => navigate(`/edit-article/${id}`);
  const handleGoToAuthorPage = () => navigate("/author-page");
  const handleLogout = () => navigate("/signup");
  const handleGoToHomePage = () => navigate("/");

  const handleGoToProfilePage = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 mb-6 shadow-md bg-gray-100">
        <div className="flex-shrink-0 pl-4">
          <a href="/">
            <img src="./logo2.png" alt="Logo" className="h-8 md:h-12 w-auto transition-transform hover:scale-105" />
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <div className="w-full flex items-center bg-gray-100 rounded-lg hover:bg-custom-green-1 transition-colors duration-200">
              <input
                type="text"
                placeholder="Search articles or authors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent py-2 px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Navbar Buttons */}
          <TooltipProvider>
            <Tooltip content="Go to Home">
              <Button onClick={handleGoToHomePage} className="bg-gray-100 text-black py-2 px-3 rounded-lg hover:scale-105 hover:bg-blue-500 shadow-none">
                <FaHome size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="Go to Admin Page">
              <Button
                onClick={handleGoToAuthorPage}
                className="bg-blue-400 text-gray-800 py-2 px-3 rounded-lg hover:scale-105 hover:bg-blue-500 shadow-none"
              >
                Admin Page
              </Button>
            </Tooltip>
            <Tooltip content="Log Out">
              <Button onClick={handleLogout} className="bg-gray-100 text-red-700 py-2 px-3 rounded-lg hover:scale-105 hover:bg-red-300 shadow-none">
                <FaSignOutAlt size={24} />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-10 py-2 bg-gray-100">
        {/* Authors & Articles */}
        {authors
          .filter(
            (author) =>
              author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              author.articles.some((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((author) => (
            <div key={author.id} className="mb-10">
              <div className="flex items-center space-x-4">
                <img src={author.profilePicture} alt={author.name} className="w-16 h-16 rounded-full" />
                <h2 className="text-xl font-semibold">{author.name}</h2>

                {/* Author Actions */}
                <div className="ml-auto space-x-3">
                <Button
                    onClick={() => handleGoToProfilePage(author.id)}
                    className="text-gray-800 py-1 bg-gray-100 px-3 rounded-lg hover:bg-blue-400 shadow-none"
                  >
                    <FaUser size={24} />
                  </Button>

                  <Button
                    onClick={() => handleDeleteAuthor(author.id)}
                    className="text-red-500 py-1 bg-gray-100 px-3 rounded-lg hover:bg-red-400 hover:text-gray-800 shadow-none"
                  >
                    Delete
                  </Button>

                </div>
              </div>

              {/* Articles */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {author.articles.map((article) => (
                  <Link to={article.link} key={article.id} className="block">
                    <Card className="hover:shadow-md max-w-full transition-transform transform hover:scale-105 p-2">
                      <CardHeader className="p-0">
                        <img src={article.bannerImage} alt={article.title} className="w-full h-40 object-cover rounded-t-md" />
                      </CardHeader>
                      <CardContent className="p-3">
                        <CardTitle className="text-lg font-semibold mb-2 text-gray-800 hover:underline ">
                          {article.title}
                        </CardTitle>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4">
                        <Button onClick={() => handleEdit(article.id)} variant="ghost" className="text-blue-500 hover:bg-blue-400 hover:text-gray-800">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(author.id, article.id)} variant="ghost" className="text-red-500 hover:bg-red-400 hover:text-gray-800">
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Admin;
