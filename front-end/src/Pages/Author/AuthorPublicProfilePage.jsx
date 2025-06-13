import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorPublicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/public/${id}`
        );
        setAuthor(response.data);
      } catch (err) {
        setError("Failed to load author profile");
        console.error("Error fetching author data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const getFileNameFromPhoturl = (url) => {
    if (!url) return "";
    
    if (url.startsWith("http")) {
      return url; 
  };

  if (url.startsWith('res.cloudinary.com')) {
    return `https://${url}`;
  }
}

  if (error) {
    return (
      <div className="dark:bg-custom-dark dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-custom-dark dark:text-white min-h-screen">
     
      {/* Author Profile Section - Dynamic content */}
      <section className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg bg-white dark:bg-custom-dark shadow">
            <Skeleton className="w-32 h-32 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-2 w-full max-w-md">
              <Skeleton className="h-8 w-3/4 bg-gray-300" />
              <Skeleton className="h-16 w-full bg-gray-300" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center p-6 rounded-lg bg-white dark:bg-custom-dark shadow">
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
            <div className="md:ml-8 mt-6 md:mt-0">
              <h2 className="text-3xl font-semibold">{author.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl">
                {author.bio || "This author hasn't written a bio yet."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Articles Section - Dynamic content */}
      <section className="container mx-auto px-6 pb-12">
        <h2 className="text-2xl font-semibold mb-6">
          {loading ? (
            <Skeleton className="h-8 w-64 bg-gray-400" />
          ) : (
            `Articles by ${author.name}`
          )}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton className="h-[150px] w-full rounded-lg mb-3 bg-gray-300" />
                <Skeleton className="h-5 w-3/4 mb-2 bg-gray-300" />
                <Skeleton className="h-4 w-2/3 mb-2 bg-gray-300" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-20 bg-gray-300" />
                  <Skeleton className="h-4 w-16 bg-gray-300" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
        )}
      </section>
    </div>
  );
};

export default AuthorPublicProfilePage;