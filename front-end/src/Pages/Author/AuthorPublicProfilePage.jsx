import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorPublicProfilePage = () => {
  const { id } = useParams(); // Get the user ID from URL params
  const navigate = useNavigate(); // Used for navigation
  const [author, setAuthor] = useState(null); // State for author data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/public/${id}`
        );
        setAuthor(response.data);
      } catch (err) {
        setError("Failed to load author profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const getFileNameFromPhoturl = (url) => {
    if (!url) return "";
    const formattedUrl = `${url.replace(/\\/g, "/")}`;
    return `http://localhost:5000/${formattedUrl}`;
  };

  if (loading) {
    return (
      <div className="dark:bg-custom-dark dark:text-white min-h-screen">
        {/* Skeleton for Author Profile */}
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="flex flex-col gap-2 w-full max-w-md">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        {/* Skeleton for Articles */}
        <div className="container mx-auto px-6 py-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton className="h-[150px] w-full rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dark:bg-custom-dark dark:text-white min-h-screen">
      {/* Author Profile Section */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center p-6 rounded-lg">
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
                className="text-gray-500 dark:text-gray-400"
              />
            )}
          </Avatar>
          <div className="ml-6">
            <h2 className="text-3xl font-semibold">{author.name}</h2>
            <p className="text-gray-400">{author.email}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {author.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-2xl font-semibold mb-4">
          Articles by {author.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {author.articles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate(`/articles/${article.id}`)}
              className="cursor-pointer"
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
                <CardContent className="flex justify-between items-center p-3 sm:p-4">
                  <p className="font-semibold text-teal-700">{author.name}</p>
                  <p className="font-semibold text-teal-700">
                    {new Date(article.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorPublicProfilePage;
