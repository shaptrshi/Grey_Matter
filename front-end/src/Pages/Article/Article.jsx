import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaLinkedinIn, FaLink } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const Article = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    const fetchArticle = async () => {
      try {
        const backendUrl = `http://localhost:5000/api/articles/${id}`;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await axios.get(backendUrl, { headers });

        const articleData = data?.article || data;
        setArticle(articleData);

        if (userData?._id && articleData?.author?._id) {
          setIsAuthor(userData._id === articleData.author._id);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchRecommendedArticles = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/articles/random"
        );
        setRecommendedArticles(data.articles || []);
      } catch (error) {
        console.error("Failed to fetch recommended articles:", error);
      }
    };

    fetchRecommendedArticles();
  }, []);

  const shareArticle = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this amazing article!");

    switch (platform) {
      case "facebook":
        window.open(
          `https://facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(`https://linkedin.com/shareArticle?url=${url}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${text} ${url}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=${text}&body=${url}`, "_self");
        break;
      case "link":
        copyUrlToClipboard();
        break;
      default:
        break;
    }
  };

  const copyUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsUrlCopied(true);
        toast.success("URL copied to clipboard!");
        setTimeout(() => setIsUrlCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy URL!");
      });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-8 max-w-screen-xl">
        <Skeleton className="w-full h-[300px] mb-6" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <Skeleton className="w-full h-80 mb-8" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20 text-red-500">Article not found.</div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-5 py-8 max-w-screen-xl">
        {/* Banner */}
        <div className="relative w-70 h-60 md:h-[25rem] lg:h-[30rem] overflow-hidden mb-8 flex items-center justify-center text-center">
          <div className="absolute z-20 text-white px-5 md:px-10 lg:px-20">
            <h1 className="text-5xl md:text-6xl font-semibold mb-4">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              By{" "}
              <Link
                to={`/profile/${article.author?._id}`}
                className="text-white hover:underline"
              >
                {article.author?.name || "Unknown Author"}
              </Link>{" "}
              | {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>
          {article.bannerImage && (
            <img
              src={article.bannerImage}
              alt={article.title || "Article Banner"}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10"></div>
        </div>

        {/* Content */}
        <Card className="overflow-hidden dark:bg-custom-dark ">
          <CardContent className="p-6">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </CardContent>
        </Card>

        {/* Share */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Share this article
          </h2>
          <div className="flex space-x-4">
            {["linkedin", "email", "link"].map((platform, index) => (
              <Button
                key={index}
                aria-label={`Share on ${platform}`}
                variant="outline"
                onClick={() => shareArticle(platform)}
                className={`bg-white dark:bg-custom-dark text-black p-5 text-xl rounded-md shadow-sm transition-transform transform hover:scale-110 border-none 
                ${
                  platform === "linkedin" &&
                  "text-blue-900 hover:bg-blue-700 dark:text-blue-700 dark:hover:bg-blue-800"
                } ${
                  platform === "email" &&
                  "text-red-600 hover:bg-red-400 dark:text-red-700 dark:hover:bg-red-500"
                } ${
                  platform === "link" &&
                  "text-gray-600 hover:bg-gray-500 dark:text-gray-600 dark:hover:bg-gray-600"
                }`}
              >
                {platform === "linkedin" && <FaLinkedinIn />}
                {platform === "email" && <MdEmail />}
                {platform === "link" && <FaLink />}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
            Topics
        </h2>
        {Array.isArray(article.tags) && (
          <div className="flex flex-wrap justify-left gap-2 mb-5 px-2">
            {article.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-white dark:bg-custom-dark text-gray-700 font-bold dark:text-gray-400 text-sm sm:text-base px-3 py-1 rounded-full hover:text-custom-green dark:hover:text-custom-green cursor-pointer border-2 border-gray-400 dark:border-gray-700"
              >
                {tag.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Feedback */}
        <div className="mt-10">
          <Button
            variant="outline"
            onClick={() =>
              (window.location.href =
                "mailto:shaptrshik@gmail.com?subject=Feedback on Article&body=Your message here.")
            }
            className="rounded-lg border-2 border-black dark:text-gray-100 dark:bg-custom-dark bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
          >
            Send Feedback
          </Button>
        </div>

        {/* Recommendations */}
        {recommendedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              You May Enjoy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {recommendedArticles.map((article, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-transform transform hover:scale-105 p-2 h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black"
                  onClick={() => navigate(`/articles/${article._id}`)}
                >
                  <div className="relative h-[150px] sm:h-[150px]">
                    <img
                      src={article.bannerImage}
                      alt={article.title || "Recommended Article"}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader className="p-3 sm:p-4 pt-0">
                    <CardTitle className="text-lg sm:text-lg font-semibold text-gray-800 line-clamp-2 hover:underline dark:text-gray-100">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <p className="font-semibold text-teal-700">
                        {article.author?.name || "Unknown Author"}
                      </p>
                      <p className="font-semibold text-teal-700">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Article;
