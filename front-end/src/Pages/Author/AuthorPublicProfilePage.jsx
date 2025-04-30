import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

const AuthorPublicProfilePage = () => {
  const { id } = useParams(); // Get the user ID from URL params
  const [author, setAuthor] = useState(null); // State for author data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`
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

  if (loading) {
    return <div>Loading...</div>; // You can add a more styled loading spinner here
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
                src={author.profilePicture}
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
            <Link to={article.link} key={article.id} className="block">
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
                      {article.author}
                    </p>
                    <p className="font-semibold text-teal-700">
                      {article.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorPublicProfilePage;
