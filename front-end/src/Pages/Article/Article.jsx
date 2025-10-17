import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaLinkedinIn, FaLink } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";

const API_BASE = "https://api.thatgreymatter.com";

const Article = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [articleLoading, setArticleLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const fetchArticle = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl = `${API_BASE}/api/articles/${id}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(backendUrl, { headers });

      setArticle(data?.article || data);
    } catch (error) {
      console.error("Error fetching article:", error);
      setArticle(null);
    } finally {
      setArticleLoading(false);
    }
  }, [id]);

  const fetchRecommendedArticles = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/articles/random`);
      setRecommendedArticles(data.articles || []);
    } catch (error) {
      console.error("Failed to fetch recommended articles:", error);
    } finally {
      setRecommendedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    fetchRecommendedArticles();
  }, [fetchRecommendedArticles]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const shareArticle = useCallback(
    (platform) => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(article?.title || "Check out this amazing article!");

      const shareUrls = {
        linkedin: `https://linkedin.com/shareArticle?url=${url}`,
        email: `mailto:?subject=${text}&body=${url}`,
      };

      if (platform === "link") {
        copyUrlToClipboard();
        return;
      }

      if (shareUrls[platform]) {
        window.open(shareUrls[platform], platform === "email" ? "_self" : "_blank");
      }
    },
    [article]
  );

  const copyUrlToClipboard = useCallback(() => {
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
  }, []);

  const renderShareButton = (platform, icon, colorClass) => (
    <Button
      aria-label={`Share on ${platform}`}
      variant="outline"
      onClick={() => shareArticle(platform)}
      className={`bg-white dark:bg-custom-dark p-5 text-xl rounded-md shadow-sm transition-transform transform hover:scale-110 border-none ${colorClass}`}
    >
      {icon}
    </Button>
  );

  if (!article && !articleLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Article not found</h2>
        <Button onClick={() => navigate("/")} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-5 py-8 max-w-screen-xl">
        {/* Banner - Only show skeleton if article is loading */}
        {articleLoading ? (
          <div className="w-full aspect-video md:aspect-[16/7] lg:aspect-[16/6] overflow-hidden mb-8 rounded-xl bg-gray-200 dark:bg-gray-800">
            <Skeleton className="w-full h-full bg-gray-300" />
          </div>
        ) : (
          <div className="relative w-full aspect-video md:aspect-[16/7] lg:aspect-[16/6] overflow-hidden mb-8 rounded-xl">
            {article?.bannerImage && (
              <>
                <img
                  src={article.bannerImage}
                  alt={article.title || "Article Banner"}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
              </>
            )}
            <div className="absolute bottom-0 left-0 right-0 z-20 text-white px-5 md:px-10 lg:px-20 pb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                {article?.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 drop-shadow-md">
                By{" "}
                <Link
                  to={`/profile/${article?.author?._id}`}
                  className="font-semibold hover:underline"
                >
                  {article?.author?.name || "Unknown Author"}
                </Link>{" "}
                ·{" "}
                {article?.createdAt
                  ? new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* Content - Only show skeleton if article is loading */}
        {articleLoading ? (
          <div className="space-y-4 mb-8">
            <Skeleton className="h-6 w-full bg-gray-300" />
            <Skeleton className="h-6 w-5/6 bg-gray-300" />
            <Skeleton className="h-6 w-4/5 bg-gray-300" />
            <Skeleton className="h-6 w-full bg-gray-300" />
            <Skeleton className="h-6 w-3/4 bg-gray-300" />
          </div>
        ) : (
          <Card className="overflow-hidden dark:bg-custom-dark shadow-sm mb-8">
            <CardContent className="p-6 md:p-8">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article?.content || ""),
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Share & Tags Section - Always visible */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Share */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Share this article</h2>
            <div className="flex flex-wrap gap-3">
              {renderShareButton(
                "linkedin",
                <FaLinkedinIn className="text-blue-700 dark:text-blue-600" />,
                "hover:bg-blue-100 dark:hover:bg-blue-900/50"
              )}
              {renderShareButton(
                "email",
                <MdEmail className="text-red-600 dark:text-red-500" />,
                "hover:bg-red-100 dark:hover:bg-red-900/50"
              )}
              {renderShareButton(
                "link",
                <FaLink className="text-gray-600 dark:text-gray-400" />,
                "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            </div>
          </div>

          {/* Tags - Only show skeleton if article is loading */}
          {articleLoading ? (
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Topics</h2>
              {Array.isArray(article?.tags) && article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white dark:bg-custom-dark text-gray-700 dark:text-gray-400 text-sm px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600"
                    >
                      {tag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No topics listed</p>
              )}
            </div>
          )}
        </div>

        {/* Feedback - Always visible */}
        <div className="mt-10">
          <Button
            variant="outline"
            onClick={() =>
              (window.location.href = `mailto:robbiesrivastava@icloud.com?subject=Feedback on "${article?.title || "this article"}"&body=Your feedback here...`)
            }
            className="rounded-lg border-2 border-black dark:border-gray-600 dark:text-gray-100 dark:bg-custom-dark bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
          >
            Send Feedback
          </Button>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">You May Also Like</h2>

          {recommendedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-[300px] dark:bg-custom-dark">
                  <Skeleton className="h-[150px] w-full rounded-t-lg bg-gray-300" />
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-full bg-gray-300" />
                    <Skeleton className="h-6 w-3/4 bg-gray-300" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-1/2 bg-gray-300" />
                    <Skeleton className="h-4 w-1/3 bg-gray-300" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recommendedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedArticles.map((article) => (
                <div
                  key={article._id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/articles/${article._id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/articles/${article._id}`);
                    }
                  }}
                  className="block cursor-pointer"
                >
                  <Card className="hover:shadow-md h-[300px] dark:bg-custom-dark dark:border-none transition-transform transform hover:scale-105 dark:shadow-sm dark:shadow-black flex flex-col">
                    <div className="relative h-[150px] overflow-hidden rounded-t-lg">
                      <img
                        src={article.bannerImage}
                        alt={article.title || "Recommended Article"}
                        className="w-full h-full object-cover rounded-t-lg inset-0"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader className="p-3 sm:p-4 mt-1 h-[3.5rem] flex flex-col justify-end">
                      <CardTitle className="text-lg font-semibold line-clamp-2 hover:underline dark:text-gray-100 text-gray-800 leading-snug">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 mt-auto">
                      <div className="flex justify-between items-center font-semibold text-xs sm:text-sm text-teal-700">
                        <Link
                          to={`/profile/${article.author?._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline"
                        >
                          {article.author?.name || "Unknown"}
                        </Link>
                        <span>
                          {article.createdAt
                            ? new Date(article.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recommendations available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
