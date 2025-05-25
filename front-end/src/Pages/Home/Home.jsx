import React, { useState, useEffect, useCallback, memo } from "react";
import { MdNavigateBefore, MdNavigateNext, MdRssFeed, MdArrowForward } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

// Memoized Article Card Component
const ArticleCard = memo(({ article, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[150px] w-full rounded-t-lg" />
        <Skeleton className="h-6 w-full" />
        <div className="flex justify-between px-4 pb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  return (
    <Link to={article.link || `/articles/${article._id}`}>
      <Card className="hover:shadow-md transition-transform hover:scale-105 h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black">
        <div className="relative h-[150px] sm:h-[150px]">
          <img
            src={article.bannerImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            loading="lazy"
          />
        </div>
        <CardHeader className="p-3 sm:p-4 mt-1">
          <CardTitle className="text-lg sm:text-lg font-semibold text-gray-800 line-clamp-2 hover:underline dark:text-gray-100">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="flex justify-between items-center text-xs sm:text-sm mt-5">
            <Link 
              to={`/profile/${article.author?._id}`} 
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-teal-700 hover:underline hover:text-teal-800 dark:hover:text-teal-500"
            >
              {article.author?.name || article.author || "Unknown"}
            </Link>
            <p className="font-semibold text-teal-700">
              {article.date || new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ArticleCard.displayName = "ArticleCard";

// Memoized Section Component
const Section = memo(({ title, articles, loading, limit = 4, genre }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    const routeMap = {
      "Trending": "/trending",
      "Environment": "/environment",
      "Sustainable_Living": "/sustainable-living",
      "Interviews": "/interviews",
      "Spotlight": "/spotlight"
    };
    
    navigate(routeMap[genre] || "/");
  };

  return (
    <div className="mt-10 sm:mt-11">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <Button 
          variant="ghost" 
          onClick={handleSeeMore}
          className="text-custom-green hover:text-custom-green-1 dark:text-custom-green dark:hover:text-custom-green-1"
        >
          See More <MdArrowForward className="ml-1" />
        </Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, index) => (
            <ArticleCard key={index} loading={true} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {articles?.slice(0, limit).map((article, index) => (
            <ArticleCard key={index} article={article} loading={false} />
          ))}
        </div>
      )}
    </div>
  );
});

Section.displayName = "Section";

const Home = () => {
  const [trending, setTrending] = useState({ data: [] });
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [environment, setEnvironment] = useState({ data: [] });
  const [sustainable, setSustainable] = useState({ data: [] });
  const [interviews, setInterviews] = useState({ data: [] });
  const [spotlight, setSpotlight] = useState({ data: [] });
  const [activeArticle, setActiveArticle] = useState(0);
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [loading, setLoading] = useState({
    trending: true,
    featured: true,
    latest: true,
    environment: true,
    sustainable: true,
    interviews: true,
    spotlight: true,
  });

  const fetchArticlesByGenre = useCallback(
    async (genre, setter, loadingKey) => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/articles/genre/${genre}?sort=${sort}&page=${currentPage}&limit=8`
        );
        setter(data);
      } catch (e) {
        console.error(`Error fetching ${genre}:`, e);
      } finally {
        setLoading((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [sort, currentPage]
  );

  useEffect(() => {
    fetchArticlesByGenre("Trending", setTrending, "trending");
    fetchArticlesByGenre("Environment", setEnvironment, "environment");
    fetchArticlesByGenre("Sustainable_Living", setSustainable, "sustainable");
    fetchArticlesByGenre("Interviews", setInterviews, "interviews");
    fetchArticlesByGenre("Spotlight", setSpotlight, "spotlight");
  }, [fetchArticlesByGenre, sort, currentPage]);

  const fetchFeatured = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/articles/featured"
      );
      setFeatured(data);
    } catch (e) {
      console.error("Error fetching featured:", e);
    } finally {
      setLoading((prev) => ({ ...prev, featured: false }));
    }
  }, []);

  const fetchLatest = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/articles/latest"
      );
      setLatest(data);
    } catch (e) {
      console.error("Error fetching latest:", e);
    } finally {
      setLoading((prev) => ({ ...prev, latest: false }));
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
    fetchLatest();
  }, [fetchFeatured, fetchLatest]);

  const handleNext = useCallback(() => {
    setActiveArticle((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  const handlePrev = useCallback(() => {
    setActiveArticle((prev) => (prev - 1 + featured.length) % featured.length);
  }, [featured.length]);

  const handleSeeMoreTrending = () => {
    navigate("/trending");
  };

  return (
    <div className="container mx-auto px-4 sm:px-10 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen bg-gray-100 dark:bg-custom-dark dark:text-gray-100">
      {/* Banner Section Top */}
      <div className="w-full -mt-2 sm:-mt-3 lg:-mt-5 mb-4 sm:mb-5">
        <img
          src="./whitegreen.png"
          alt="Light Mode Banner"
          className="w-full h-auto max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56 object-cover rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 dark:hidden"
          loading="eager"
        />
        <img
          src="./dark.png"
          alt="Dark Mode Banner"
          className="w-full h-auto max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56 object-cover rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 hidden dark:block"
          loading="eager"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 sm:gap-5">
        {/* Trending News Section */}
        <div className="lg:col-span-3 bg-white dark:bg-custom-dark p-4 sm:p-6 hidden lg:block border:none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-lg font-semibold text-gray-800 dark:text-gray-100 -mt-5">
              Trending
            </h2>
            <Button 
              variant="ghost" 
              onClick={handleSeeMoreTrending}
              className="text-custom-green hover:text-custom-green-1 dark:text-custom-green dark:hover:text-custom-green-1"
            >
              See More <MdArrowForward className="ml-1" />
            </Button>
          </div>
          {loading.trending ? (
            <div className="flex flex-col gap-8">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-8">
              {trending.data?.slice(0, 7).map((article, index) => (
                <Link
                  to={article.link || `/articles/${article._id}`}
                  key={index}
                  className="gap-8"
                >
                  <Card className="hover:shadow-lg transition-transform hover:scale-105 hover:bg-custom-green-1 dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black">
                    <CardHeader className="p-3 sm:p-4">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 hover:underline line-clamp-2 dark:text-gray-100">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0 flex justify-between items-center">
                      <Link 
                        to={`/profile/${article.author?._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs sm:text-sm font-semibold text-teal-700 hover:underline hover:text-teal-800 dark:hover:text-teal-500"
                      >
                        {article.author?.name || article.author || "Unknown"}
                      </Link>
                      <p className="text-xs sm:text-sm font-semibold text-teal-700">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </ul>
          )}
        </div>

        {/* Middle Section */}
        <div className="lg:col-span-6">
          {/* Featured News Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden relative h-[250px] sm:h-[300px] lg:h-[400px]">
            {loading.featured ? (
              <div className="w-full h-full relative">
                <Skeleton className="w-full h-full rounded-xl" />
                <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 mb-2">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 -translate-y-1/2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ) : featured.length > 0 ? (
              <>
                <img
                  src={featured[activeArticle]?.bannerImage || ""}
                  alt={featured[activeArticle]?.title || "Featured Article"}
                  className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                <Link
                  to={
                    featured[activeArticle]?.link ||
                    `/articles/${featured[activeArticle]?._id}`
                  }
                >
                  <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 mb-2 text-white">
                    <h3 className="text-lg sm:text-xl lg:text-3xl font-semibold hover:underline">
                      {featured[activeArticle]?.title || "Featured Article"}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <Link 
                        to={`/authors/${featured[activeArticle]?.author?._id || featured[activeArticle]?.author}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-teal-300 hover:underline"
                      >
                        {featured[activeArticle]?.author?.name || featured[activeArticle]?.author || "Unknown"}
                      </Link>
                      <p className="text-sm font-semibold text-teal-300">
                        {new Date(featured[activeArticle]?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 -translate-y-1/2">
                  <button
                    onClick={handlePrev}
                    className="text-white hover:text-custom-green p-2"
                    aria-label="Previous article"
                  >
                    <MdNavigateBefore size={28} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="text-white hover:text-custom-green p-2"
                    aria-label="Next article"
                  >
                    <MdNavigateNext size={28} />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p>No featured articles available</p>
              </div>
            )}
          </div>

          {/* Latest News Grid */}
          <div className="mt-4 sm:mt-5">
            <h2 className="text-xl sm:text-lg font-semibold text-gray-800 mb-3 dark:text-gray-100 pb-1 pt-1">
              Latest News
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading.latest
                ? [...Array(4)].map((_, index) => (
                    <ArticleCard key={index} loading={true} />
                  ))
                : latest
                    .slice(0, 4)
                    .map((article, index) => (
                      <ArticleCard
                        key={index}
                        article={article}
                        loading={false}
                      />
                    ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Contact Us Card */}
          {loading.featured ? (
            <Skeleton className="h-[250px] sm:h-[300px] lg:h-[400px] rounded-xl" />
          ) : (
            <div className="rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 h-[250px] sm:h-[300px] lg:h-[400px] bg-custom-green-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                Contact Us
              </h2>
              <p className="text-gray-800 mb-10 dark:text-gray-800">
                Got a story or suggestion? <br /> We'd love to hear from you!
              </p>
              <Link to="/contact">
                <Button
                  variant="primary"
                  className="w-full rounded-full bg-custom-green text-custom-green-1 hover:scale-105 mt-6 lg:mt-36 font-bold"
                >
                  Contact Us
                  <MdNavigateNext size={24} className="ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {/* Subscribe Card */}
          {loading.featured ? (
            <div className="rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 h-[250px] sm:h-[300px] relative">
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-5/6 mb-10" />
              <div className="absolute bottom-6 left-4 right-4">
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 h-[250px] sm:h-[300px] bg-custom-green">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-3">
                Subscribe
              </h2>
              <p className="text-gray-200 mb-10">
                Stay updated with our latest articles. <br /> Subscribe to our
                RSS feed now!
              </p>
              <a
                href="https://rss.com/"
                target="_blank"
                rel="noreferrer"
                className="block mt-6"
              >
                <Button
                  variant="primary"
                  className="w-full rounded-full bg-custom-accent-green text-custom-green hover:scale-105 font-bold"
                >
                  Subscribe <MdRssFeed size={24} className="ml-2" />
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-10">
        <img
          src="./Grey Matter.png"
          alt="Promotional Banner"
          className="w-auto h-auto object-cover rounded-2xl shadow-lg"
          loading="lazy"
        />
      </div>

      {/* More Articles Section */}
      <div className="flex justify-center items-center">
        <h1 className="text-3xl mt-10 font-semibold text-gray-800 dark:text-gray-100">
          More Articles You'll Love
        </h1>
      </div>

      {/* Memoized Sections */}
      <Section
        title="Spotlight"
        articles={spotlight.data}
        loading={loading.spotlight}
        genre="Spotlight"
      />
      <Section
        title="Environment"
        articles={environment.data}
        loading={loading.environment}
        genre="Environment"
      />
      <Section
        title="Sustainable Living"
        articles={sustainable.data}
        loading={loading.sustainable}
        genre="Sustainable_Living"
      />
      <Section
        title="Interviews"
        articles={interviews.data}
        loading={loading.interviews}
        genre="Interviews"
      />
    </div>
  );
};

export default memo(Home);