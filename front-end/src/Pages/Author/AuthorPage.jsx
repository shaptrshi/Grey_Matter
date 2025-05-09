import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaHome, FaSignOutAlt, FaPlus, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import logo from "../../assets/logo2.png";
import SearchBar from "../../components/searchbar/searchbar";

const AuthorPage = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState({
    name: "",
    email: "",
    bio: "",
    profilePicture: "",
    articles: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;

        setAuthor({
          name: userData.name,
          email: userData.email,
          bio: userData.bio,
          profilePicture: userData.profilePhoto,
          articles: tryParseArticles(userData.articles, userData.name),
        });
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  function tryParseArticles(articles = [], authorName = "") {
    try {
      if (!Array.isArray(articles)) return [];

      return articles.map((article) => ({
        ...article,
        link: `/articles/${article.id || article._id}`,
        authorName,
        date: formatDate(article.updatedAt || article.createdAt),
      }));
    } catch (error) {
      console.error("Error parsing articles", error);
      return [];
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState("");

  const handleEditProfile = () => setEditMode(!editMode);
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        {
          name: author.name,
          bio: author.bio,
          profilePhoto: author.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data;

      setAuthor((prevAuthor) => ({
        ...prevAuthor,
        name: updatedUser.name,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePhoto,
      }));

      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleChange = (e) =>
    setAuthor({ ...author, [e.target.name]: e.target.value });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAuthor((prev) => ({
          ...prev,
          articles: prev.articles.filter(
            (article) => article.id !== id && article._id !== id
          ),
        }));
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProfilePicture(imageUrl);
      setAuthor((prev) => ({ ...prev, profilePicture: imageUrl }));
    }
  };

  const handleEdit = (id) => navigate(`/edit-article/${id}`);

  const handleCreateArticle = () => navigate("/create-article");

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

  const filteredArticles = author.articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileNameFromPhoturl = (url) => {
    const parts = url.split("\\");
    return parts[parts.length - 1];
  };


  return (
    <div className="dark:bg-custom-dark dark:text-white min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 mb-6 shadow-lg dark:shadow-sm dark:shadow-black bg-gray-100 dark:bg-custom-dark">
        <div className="pl-4">
          <a href="/">
            <img
              src={logo}
              alt="Logo"
              className="h-8 md:h-12 w-auto hover:scale-105 transition-transform"
            />
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="sm:hidden flex items-center max-w-xs flex-1 ml-4">
            <SearchBar
              
              className="w-full"
            />
          </div>
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <SearchBar
            
              className="w-full"
            />
          </div>
          <TooltipProvider>
            <Tooltip content="Go to Home">
              <Button
                onClick={handleGoToHomePage}
                className="bg-gray-100 dark:bg-custom-dark text-black dark:text-white py-2 px-3 rounded-lg hover:scale-105 dark:hover:bg-blue-600 hover:bg-blue-500 transition transform"
              >
                <FaHome size={24} />
              </Button>
            </Tooltip>
            <Tooltip content="Log Out">
              <Button
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-custom-dark text-red-700 dark:text-red-500 py-2 px-3 rounded-lg hover:scale-105 dark:hover:bg-red-400 hover:bg-red-300 transition transform"
              >
                <FaSignOutAlt size={24} />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>

      {/* Author Profile Section */}
      <div className="container mx-auto px-6 py-6 relative -mt-2">
        <div className="hidden md:block absolute top-4 right-4 z-10">
          <TooltipProvider>
            <Tooltip content="Create Article">
              <Button
                onClick={handleCreateArticle}
                className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 dark:text-white text-white p-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                Create Article
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Author Profile Card */}
        <div className="flex flex-col md:flex-row items-center md:items-start  p-6 rounded-lg">
          <div className="relative">
            <Avatar className="w-32 h-32">
              {author.profilePicture ? (
                <AvatarImage
                  src={getFileNameFromPhoturl(author.profilePicture)}
                  alt="Profile Picture"
                  className="rounded-full object-cover"
                />
              ) : (
                <FaUserCircle
                  size={128}
                  className="text-gray-500 dark:text-gray-400 object-cover"
                />
              )}
            </Avatar>
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="absolute bottom-0 left-0 w-full opacity-0 cursor-pointer"
              />
            )}
          </div>
          <div className="ml-6 w-full">
            {editMode ? (
              <div className="space-y-3">
                <Input
                  name="name"
                  value={author.name}
                  onChange={handleChange}
                  className="text-2xl font-bold dark:bg-gray-700 dark:text-white"
                />
                <p className="text-gray-400">{author.email}</p>
                <Textarea
                  name="bio"
                  value={author.bio}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:text-white"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="w-48 px-2 py-1 text-sm dark:bg-gray-700 dark:text-white border rounded-md cursor-pointer"
                />
                <Button
                  onClick={handleSaveProfile}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Save Profile
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-semibold">{author.name}</h2>
                <p className="text-gray-400">{author.email}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {author.bio}
                </p>
                <Button
                  onClick={handleEditProfile}
                  variant="outline"
                  className="mt-3 dark:text-white dark:bg-gray-700 bg-gray-400 transition-transform transform hover:scale-105"
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Create Article Button for Mobile Screens (Icon Only) */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <TooltipProvider>
            <Tooltip content="Create Article">
              <button
                onClick={handleCreateArticle}
                className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
              >
                <FaPlus size={20} />
              </button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-2xl font-semibold mb-4">Your Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredArticles.map((article) => (
            <Card
              key={article._id || article.id}
              className="hover:shadow-md transition-transform transform hover:scale-105 p-2 h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black"
              onClick={() => navigate(article.link)}
            >
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
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <p className="font-semibold text-teal-700">
                    {article.authorName}
                  </p>
                  <p className="font-semibold text-teal-700">{article.date}</p>
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(article._id);
                    }}
                    variant="outline"
                    size="sm"
                    className="dark:text-white dark:bg-gray-700 hover:bg-gray-400"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(article._id);
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
