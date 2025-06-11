import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaHome, FaSignOutAlt, FaPlus, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import logo from "../../assets/logo.svg";
import SearchBar from "../../components/searchbar/searchbar";
import { Skeleton } from "@/components/ui/skeleton";
import toast, { Toaster } from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const AuthorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState("");


  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch basic user info first
      const userResponse = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = userResponse.data;

      // Then fetch paginated articles using page from URL
      const articlesResponse = await axios.get(
        `http://localhost:5000/api/users/profile?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const articlesData = articlesResponse.data;

      setAuthor({
        name: userData.name,
        email: userData.email,
        bio: userData.bio,
        profilePicture: userData.profilePhoto,
        articles: tryParseArticles(articlesData.articles.data, userData.name),
      });

      setTotalPages(articlesData.articles.pagination.totalPages);
      setTotalArticles(articlesData.articles.pagination.totalArticles);
    } catch (error) {
      setError("Failed to load profile data");
      toast.error("Failed to load profile");
      console.error("Error fetching user profile", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const tryParseArticles = useCallback((articles = [], authorName = "") => {
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
  }, []);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(page));
      navigate(`?${newParams.toString()}`, { replace: true });
    },
    [navigate, searchParams]
  );

  const handleEditProfile = useCallback(
    () => setEditMode(!editMode),
    [editMode]
  );

  const handleSaveProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const loadingToast = toast.loading("Saving profile...");

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
      toast.success("Profile updated successfully", { id: loadingToast });
    } catch (error) {
      setError("Failed to update profile");
      toast.error("Failed to update profile", { id: loadingToast });
      console.error("Error updating profile", error);
    } finally {
      setLoading(false);
    }
  }, [author]);

  const handleChange = useCallback((e) => {
    setAuthor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const token = localStorage.getItem("token");
        const loadingToast = toast.loading("Deleting article...");

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
        setTotalArticles((prev) => prev - 1);
        toast.success("Article deleted successfully", { id: loadingToast });
      } catch (error) {
        setError("Failed to delete article");
        toast.error("Failed to delete article", { id: loadingToast });
        console.error("Error deleting article:", error);
      }
    }
  }, []);

  const handleProfilePictureChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProfilePicture(imageUrl);
      setAuthor((prev) => ({ ...prev, profilePicture: imageUrl }));
      toast.success("Profile picture updated");
    }
  }, []);

  const handleEdit = useCallback(
    (id) => navigate(`/edit-article/${id}`),
    [navigate]
  );
  const handleCreateArticle = useCallback(
    () => navigate("/create-article"),
    [navigate]
  );
  const handleLogout = useCallback(async () => {
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
      toast.error("Failed to log out");
      console.error("Error logging out", error);
    }
  }, [navigate]);

  const handleGoToHomePage = useCallback(() => navigate("/"), [navigate]);

  const filteredArticles = useMemo(
    () =>
      author?.articles?.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [author?.articles, searchTerm]
  );

  const getFileNameFromPhoturl = useCallback((url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    if (url.startsWith("res.cloudinary.com")) {
      return `https://${url}`;
    }
    return url;
  }, []);

  // Memoized pagination items
  const paginationItems = useMemo(() => {
    if (totalPages <= 1) return null;

    const pageNumbersToShow = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(pageNumbersToShow / 2)
    );
    let endPage = startPage + pageNumbersToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pageNumbersToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
      const pageNum = startPage + i;
      return (
        <PaginationItem key={pageNum}>
          <PaginationLink
            isActive={pageNum === currentPage}
            onClick={() => handlePageChange(pageNum)}
            className="cursor-pointer"
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      );
    });
  }, [totalPages, currentPage, handlePageChange]);

  if (error) {
    return (
      <div className="dark:bg-custom-dark dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Error</h2>
          <p className="mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-custom-dark dark:text-white min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 mb-6 shadow-lg dark:shadow-sm dark:shadow-black bg-gray-100 dark:bg-custom-dark">
        <div className="pl-4">
          <img
            src={logo}
            alt="Logo"
            className="h-8 md:h-12 w-auto hover:scale-105 transition-transform cursor-pointer"
            onClick={handleGoToHomePage}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="sm:hidden flex items-center max-w-xs flex-1 ml-4">
            <SearchBar className="w-full" />
          </div>
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <SearchBar className="w-full" />
          </div>
          <TooltipProvider>
            <Tooltip content="Go to Home">
              <Button
                onClick={handleGoToHomePage}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FaHome size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Log Out">
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-200 dark:hover:bg-red-400"
              >
                <FaSignOutAlt size={20} />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Create Article Button (Desktop) */}
        <div className="hidden md:block absolute top-20 right-6 z-10">
          <Button
            onClick={handleCreateArticle}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-lg transition-transform hover:scale-105"
          >
            Create Article
          </Button>
        </div>

        {/* Author Profile Section */}
        <div className="relative bg-white dark:bg-custom-dark rounded-xl  p-6 mb-8 -mt-2">
          {loading ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="w-32 h-32 rounded-full bg-gray-400 animate-pulse" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-3/4 bg-gray-400" />
                <Skeleton className="h-6 w-1/2 bg-gray-400" />
                <Skeleton className="h-16 w-full bg-gray-400" />
                <Skeleton className="h-10 w-32 bg-gray-400" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  {author?.profilePicture ? (
                    <AvatarImage
                      src={getFileNameFromPhoturl(author.profilePicture)}
                      alt="Profile Picture"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle
                      size={128}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  )}
                </Avatar>
                {editMode && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">
                      Change Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-4">
                    <Input
                      name="name"
                      value={author?.name || ""}
                      onChange={handleChange}
                      className="text-2xl font-bold dark:bg-gray-700"
                    />
                    <p className="text-gray-400">{author?.email}</p>
                    <Textarea
                      name="bio"
                      value={author?.bio || ""}
                      onChange={handleChange}
                      className="dark:bg-gray-700 min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-teal-600 hover:bg-teal-700"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-semibold">{author?.name}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{author?.email}</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                      {author?.bio || "No bio yet. Click edit to add one."}
                    </p>
                    <Button
                      onClick={handleEditProfile}
                      variant="outline"
                      className="mt-4 dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-400 hover:bg-gray-300"
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Articles Section */}
        <div className="bg-white dark:bg-custom-dark rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {loading ? <Skeleton className="h-8 w-48 bg-gray-400" /> : "Your Articles"}
            </h2>
            {!loading && totalArticles > 0 && (
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * 8 + 1}-
                {Math.min(currentPage * 8, totalArticles)} of {totalArticles}{" "}
                articles
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[150px] w-full rounded-lg bg-gray-400" />
                  <Skeleton className="h-5 w-3/4 bg-gray-400" />
                  <Skeleton className="h-4 w-1/2 bg-gray-400" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-gray-400" />
                    <Skeleton className="h-4 w-16 bg-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No articles match your search"
                  : "You haven't created any articles yet"}
              </p>
              <Button
                onClick={handleCreateArticle}
                className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Create Your First Article
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article._id || article.id}
                    className="cursor-pointer"
                    onClick={() => navigate(article.link)}
                  >
                    <Card className="hover:shadow-md transition-transform transform hover:scale-105 p-2 h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black">
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
                          <p className="font-semibold text-teal-700">
                            {article.date}
                          </p>
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(article._id || article.id);
                            }}
                            variant="outline"
                            size="sm"
                            className="dark:text-white dark:bg-gray-700 hover:bg-gray-400 bg-gray-300"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(article._id || article.id);
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
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <Pagination className="bg-white dark:bg-custom-dark p-4">
                    <PaginationContent className="flex gap-2">
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`cursor-pointer py-2 px-3 rounded-lg text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark-text-gray-100  dark:hover:text-white ${
                            currentPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          aria-label="Previous Page"
                        >
                          ←
                        </PaginationLink>
                      </PaginationItem>

                      {paginationItems}

                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`cursor-pointer py-2 px-3 rounded-lg text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark-text-gray-100  dark:hover:text-white ${
                            currentPage === totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          aria-label="Next Page"
                        >
                          →
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Create Article Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleCreateArticle}
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full shadow-lg w-12 h-12"
        >
          <FaPlus size={20} />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(AuthorPage);
