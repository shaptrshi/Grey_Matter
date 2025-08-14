import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import logo from "../../assets/logo.png";
import SearchBar from "../../components/searchbar/searchBar";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Admin = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAuthors, setExpandedAuthors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [articleCurrentPage, setArticleCurrentPage] = useState({});
  const [articlesPerPage] = useState(3);
  const navigate = useNavigate();

  // Calculate pagination for authors
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAuthors = authors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(authors.length / itemsPerPage);

  // Change page for authors
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Initialize article pagination state
  useEffect(() => {
    if (authors.length > 0) {
      const initialArticlePageState = {};
      authors.forEach((author) => {
        initialArticlePageState[author._id] = 1;
      });
      setArticleCurrentPage(initialArticlePageState);
    }
  }, [authors]);

  // Calculate pagination for articles
  const getPaginatedArticles = (authorId) => {
    const author = authors.find((a) => a._id === authorId);
    if (!author || !author.articles) return [];

    const currentPage = articleCurrentPage[authorId] || 1;
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    return author.articles.slice(indexOfFirstArticle, indexOfLastArticle);
  };

  // Change page for articles
  const paginateArticles = (authorId, pageNumber) => {
    setArticleCurrentPage((prev) => ({
      ...prev,
      [authorId]: pageNumber,
    }));
  };

  // Get total pages for articles of a specific author
  const getTotalArticlePages = (authorId) => {
    const author = authors.find((a) => a._id === authorId);
    if (!author || !author.articles) return 0;
    return Math.ceil(author.articles.length / articlesPerPage);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const filteredAuthors = response.data.data.filter(
          (user) => user.role === "author"
        );

        setAuthors(filteredAuthors);
        const initialExpandedState = {};
        filteredAuthors.forEach((author) => {
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
    setExpandedAuthors((prev) => ({
      ...prev,
      [authorId]: !prev[authorId],
    }));
  };

  const handleDeleteAuthor = async (authorId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user and all their articles?"
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/users/${authorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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
        await axios.delete(
          `http://localhost:5000/api/admin/articles/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setAuthors(
          authors.map((author) => ({
            ...author,
            articles:
              author.articles?.filter((article) => article._id !== articleId) ||
              [],
          }))
        );

        toast.success("Article deleted successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete article"
        );
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
        {/* Navbar Skeleton */}
        <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-custom-dark">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </nav>

        {/* Content Skeleton */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white dark:bg-custom-dark rounded-xl shadow-sm overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <div className="px-6 py-5 flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="flex space-x-3">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                  </div>
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
      {/* Enhanced Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-custom-dark shadow-md dark:shadow-sm  dark:shadow-black">
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto transition-transform hover:scale-105"
            />
          </a>
          <h1 className="text-xl font-semibold text-black dark:text-white pl-4">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar className="w-full" />
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="icon"
            className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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

      {/* Enhanced Table */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-custom-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {authors.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                No users found
              </h3>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-custom-dark/50">
                  <TableRow>
                    <TableHead className="w-[250px]">Author</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAuthors.map((author) => (
                    <>
                      <TableRow
                        key={author._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={author.profilePicture} />
                              <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                                {author.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <p className="font-medium">{author.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {author.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              {author.articles?.length || 0}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              articles
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => toggleAuthorExpansion(author._id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center dark:bg-custom-dark/50 dark:hover:bg-custom-dark/70"
                            >
                              {expandedAuthors[author._id] ? (
                                <>
                                  <FaChevronUp className="mr-2 h-3 w-3" /> Hide
                                </>
                              ) : (
                                <>
                                  <FaChevronDown className="mr-2 h-3 w-3" />{" "}
                                  Show
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => navigate(`/profile/${author._id}`)}
                              variant="outline"
                              size="sm"
                              className="flex items-center dark:bg-custom-dark/50 dark:hover:bg-custom-dark/70"
                            >
                              <FaUser className="mr-2 h-3 w-3" /> Profile
                            </Button>
                            <Button
                              onClick={() => handleDeleteAuthor(author._id)}
                              variant="destructive"
                              size="sm"
                            >
                              <FaTrash className="mr-2 h-3 w-3" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedAuthors[author._id] && (
                        <TableRow className="bg-gray-50 dark:bg-gray-700/10 hover:bg-gray-50">
                          <TableCell colSpan={4} className="p-0">
                            <div className="px-6 py-4">
                              <h4 className="font-medium mb-4 text-gray-700 dark:text-gray-300 flex items-center">
                                <span className="mr-2">Articles</span>
                                <Badge
                                  variant="outline"
                                  className="px-2 py-0.5"
                                >
                                  {author.articles?.length || 0}
                                </Badge>
                              </h4>
                              {author.articles?.length > 0 ? (
                                <>
                                  <div className="space-y-3">
                                    {getPaginatedArticles(author._id).map(
                                      (article) => (
                                        <div
                                          key={article._id}
                                          className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                                        >
                                          <div
                                            className="flex-shrink-0 h-16 w-24 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer"
                                            onClick={() =>
                                              navigate(
                                                `/articles/${article._id}`
                                              )
                                            }
                                          >
                                            {article.bannerImage ? (
                                              <img
                                                src={article.bannerImage}
                                                alt={article.title}
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <FaEye className="h-5 w-5" />
                                              </div>
                                            )}
                                          </div>
                                          <div
                                            className="ml-4 flex-1 min-w-0 cursor-pointer"
                                            onClick={() =>
                                              navigate(
                                                `/articles/${article._id}`
                                              )
                                            }
                                          >
                                            <h5 className="text-sm font-medium truncate hover:underline">
                                              {article.title}
                                            </h5>
                                            <div className="flex items-center mt-1">
                                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(
                                                  article.createdAt
                                                ).toLocaleDateString()}
                                              </span>
                                              {article.status && (
                                                <Badge
                                                  variant="outline"
                                                  className="ml-2 text-xs"
                                                >
                                                  {article.status}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteArticle(article._id);
                                            }}
                                            variant="destructive"
                                            size="sm"
                                            className="ml-4"
                                          >
                                            <FaTrash className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                  {author.articles.length > articlesPerPage && (
                                    <div className="flex justify-end mt-4">
                                      <div className="flex space-x-2">
                                        <Button
                                          onClick={() =>
                                            paginateArticles(
                                              author._id,
                                              articleCurrentPage[author._id] - 1
                                            )
                                          }
                                          disabled={
                                            articleCurrentPage[author._id] === 1
                                          }
                                          variant="outline"
                                          size="sm"
                                        >
                                          Previous
                                        </Button>
                                        {Array.from(
                                          {
                                            length: getTotalArticlePages(
                                              author._id
                                            ),
                                          },
                                          (_, i) => i + 1
                                        ).map((number) => (
                                          <Button
                                            key={number}
                                            onClick={() =>
                                              paginateArticles(
                                                author._id,
                                                number
                                              )
                                            }
                                            variant={
                                              articleCurrentPage[author._id] ===
                                              number
                                                ? "default"
                                                : "outline"
                                            }
                                            size="sm"
                                          >
                                            {number}
                                          </Button>
                                        ))}
                                        <Button
                                          onClick={() =>
                                            paginateArticles(
                                              author._id,
                                              articleCurrentPage[author._id] + 1
                                            )
                                          }
                                          disabled={
                                            articleCurrentPage[author._id] ===
                                            getTotalArticlePages(author._id)
                                          }
                                          variant="outline"
                                          size="sm"
                                        >
                                          Next
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="p-4 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                  <p className="text-gray-500 dark:text-gray-400">
                                    No articles found
                                  </p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls for Authors */}
              {authors.length > itemsPerPage && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, authors.length)} of{" "}
                    {authors.length} authors
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <Button
                          key={number}
                          onClick={() => paginate(number)}
                          variant={
                            currentPage === number ? "default" : "outline"
                          }
                          size="sm"
                        >
                          {number}
                        </Button>
                      )
                    )}
                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
