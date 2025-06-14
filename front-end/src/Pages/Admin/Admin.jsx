import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaHome, FaUser, FaSignOutAlt, FaChevronDown, FaChevronUp, FaTrash, FaEye } from "react-icons/fa";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import logo from "../../assets/logo.svg";
import SearchBar from "../../components/searchbar/searchBar";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Admin = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAuthors, setExpandedAuthors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAuthors(response.data.data);
        const initialExpandedState = {};
        response.data.data.forEach(author => {
          initialExpandedState[author._id] = false;
        });
        setExpandedAuthors(initialExpandedState);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleAuthorExpansion = (authorId) => {
    setExpandedAuthors(prev => ({
      ...prev,
      [authorId]: !prev[authorId]
    }));
  };

  const handleDeleteAuthor = async (authorId) => {
    if (window.confirm("Are you sure you want to delete this user and all their articles?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${authorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAuthors(authors.filter((author) => author._id !== authorId));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/articles/${articleId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setAuthors(authors.map(author => ({
          ...author,
          articles: author.articles?.filter(article => article._id !== articleId) || []
        })));
        
        toast.success("Article deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete article");
      }
    }
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
      toast.success("Logged out successfully");
      navigate("/signup");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-custom-dark">
        <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 mb-6 shadow-sm bg-white dark:bg-custom-dark">
          <div className="pl-4">
            <img src={logo} alt="Logo" className="h-8 md:h-12 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
              <SearchBar className="w-full" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </nav>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-custom-dark rounded-lg shadow overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b dark:border-custom-dark/50">
                <div className="px-6 py-4 flex items-center">
                  <Skeleton className="w-10 h-10 rounded-full mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-9 w-24 mr-2" />
                  <Skeleton className="h-9 w-24 mr-2" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-custom-dark">
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 mb-6 shadow-sm bg-white dark:bg-custom-dark">
        <div className="pl-4">
          <img src={logo} alt="Logo" className="h-8 md:h-12 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <SearchBar className="w-full" />
          </div>
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            size="icon"
            className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Home"
          >
            <FaHome className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="icon"
            className="rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
            aria-label="Logout"
          >
            <FaSignOutAlt className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-custom-dark rounded-lg shadow overflow-hidden">
          {authors.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No users found</h3>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-custom-dark/50">
                <TableRow>
                  <TableHead className="w-[200px]">Author</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authors.map((author) => (
                  <>
                    <TableRow key={author._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={author.profilePicture} />
                            <AvatarFallback>
                              {author.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{author.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {author.articles?.length || 0} articles
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-600 dark:text-gray-300">{author.email}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => toggleAuthorExpansion(author._id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center dark:bg-custom-dark"
                          >
                            {expandedAuthors[author._id] ? (
                              <>
                                <FaChevronUp className="mr-1 h-3 w-3" /> Hide
                              </>
                            ) : (
                              <>
                                <FaChevronDown className="mr-1 h-3 w-3" /> Show
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => navigate(`/profile/${author._id}`)}
                            variant="outline"
                            size="sm"
                          >
                            <FaUser className="mr-1 h-3 w-3" /> Profile
                          </Button>
                          <Button
                            onClick={() => handleDeleteAuthor(author._id)}
                            variant="destructive"
                            size="sm"
                          >
                            <FaTrash className="mr-1 h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedAuthors[author._id] && (
                      <TableRow className="bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-50">
                        <TableCell colSpan={3} className="p-0">
                          <div className="px-6 py-4">
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Articles</h4>
                            {author.articles?.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Preview</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {author.articles.map((article) => (
                                      <tr key={article._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <div 
                                            className="h-12 w-16 rounded-md bg-gray-200 dark:bg-gray-600 overflow-hidden cursor-pointer"
                                            onClick={() => navigate(`/articles/${article._id}`)}
                                          >
                                            {article.bannerImage ? (
                                              <img
                                                src={article.bannerImage}
                                                alt={article.title}
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <FaEye className="h-4 w-4" />
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <button
                                            onClick={() => navigate(`/articles/${article._id}`)}
                                            className="text-left font-medium hover:underline"
                                          >
                                            {article.title}
                                          </button>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                          {new Date(article.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                          <Button
                                            onClick={() => handleDeleteArticle(article._id)}
                                            variant="destructive"
                                            size="sm"
                                          >
                                            <FaTrash className="mr-1 h-3 w-3" /> Delete
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400 py-4">No articles found</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;