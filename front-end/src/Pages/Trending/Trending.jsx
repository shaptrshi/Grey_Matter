import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import axios from "axios";

const Trending = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTrendingArticles = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/articles/genre/Trending");
      setArticles(res.data);
    } catch (error) {
      console.error("Failed to fetch trending articles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingArticles();
  }, [fetchTrendingArticles]);

  return (
    <div className="container mx-auto px-4 sm:px-10 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen bg-gray-100 dark:bg-custom-dark dark:text-gray-100">
      <div className="mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
          Trending
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Cover recent events, trending topics, and breaking news relevant to
          your blog’s theme.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 h-[300px] rounded-lg"
              />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-center text-muted-foreground">No trending articles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {articles.map((article) => (
              <div
                key={article._id}
                onClick={() => navigate(`/articles/${article._id}`)}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-md transition-transform transform hover:scale-105 p-2 h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black">
                  <div className="relative h-[150px] sm:h-[150px]">
                    <img
                      src={article.bannerImage || "/default-image.jpg"}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader className="p-3 sm:p-4 mt-1">
                    <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2 hover:underline dark:text-gray-100">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card navigation
                          navigate(`/profile/${article.author?._id}`);
                        }}
                        className="font-semibold text-teal-700 hover:underline"
                      >
                        {article.author?.name || "Unknown"}
                      </button>
                      <p className="font-semibold text-teal-700">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
