import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdRssFeed,
  MdArrowForward,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "react-hot-toast";

const FALLBACK_IMAGE = "./placeholder-article.jpg";

// 1. Optimized Image Component
const OptimizedImage = ({ src, alt, className, priority = false }) => {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full bg-gray-400" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageSrc(FALLBACK_IMAGE);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

// 2. Intersection Observer Hook
const useIntersectionObserver = (
  options = { threshold: 0.1, rootMargin: "200px" }
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

// Memoized Article Card Component
const ArticleCard = memo(({ article, loading, priority = false }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <Skeleton className="h-[150px] w-full rounded-t-lg bg-gray-300" />
        <Skeleton className="h-6 w-full bg-gray-300" />
        <div className="flex justify-between px-4 pb-4">
          <Skeleton className="h-4 w-20 bg-gray-300" />
          <Skeleton className="h-4 w-20 bg-gray-300" />
        </div>
      </div>
    );
  }

  const handleCardClick = (e) => {
    if (e.target.closest(".author-name")) {
      return;
    }
    navigate(article.link || `/articles/${article._id}`);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    if (article.author?._id) {
      navigate(`/profile/${article.author._id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Read article: ${article.title}`}
    >
      <Card
        className={`hover:shadow-md transition-all duration-300 ${
          isHovered ? "transform scale-[1.02]" : ""
        } h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black`}
      >
        <div className="relative h-[150px] sm:h-[150px] overflow-hidden">
          <OptimizedImage
            src={article.bannerImage}
            alt={article.title}
            className="rounded-t-lg"
            priority={priority}
          />
        </div>
        <CardHeader className="p-3 sm:p-4 mt-1">
          <CardTitle className="text-lg sm:text-lg font-semibold text-gray-800 line-clamp-2 hover:underline dark:text-gray-100 transition-all">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="flex justify-between items-center text-xs sm:text-sm mt-3">
            <span
              onClick={handleAuthorClick}
              className="author-name font-semibold text-teal-700 hover:underline hover:text-teal-800 dark:hover:text-teal-500 cursor-pointer transition-colors"
            >
              {article.author?.name || article.author || "Unknown"}
            </span>
            <p className="font-semibold text-teal-700">
              {article.date || new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ArticleCard.displayName = "ArticleCard";

// Memoized Section Component
const Section = memo(({ title, articles, loading, limit = 4, genre }) => {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const navigate = useNavigate();

  const handleSeeMore = () => {
    const routeMap = {
      Trending: "/trending",
      Environment: "/environment",
      Sustainable_Living: "/sustainable-living",
      Interviews: "/interviews",
      Spotlight: "/spotlight",
    };
    navigate(routeMap[genre] || "/");
  };

  return (
    <div
      ref={sectionRef}
      id={`section-${genre}`}
      className={`mt-10 sm:mt-11 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <Button
          variant="ghost"
          onClick={handleSeeMore}
          className="text-custom-green hover:text-custom-green-1 dark:text-custom-green dark:hover:text-custom-green-1 group"
          aria-label={`See more ${title} articles`}
        >
          See More{" "}
          <MdArrowForward className="ml-1 transition-transform group-hover:translate-x-1" />
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
            <ArticleCard
              key={index}
              article={article}
              loading={false}
              priority={index < 2} // Prioritize first two images
            />
          ))}
        </div>
      )}
    </div>
  );
});

Section.displayName = "Section";

const Home = () => {
  const [articles, setArticles] = useState({
    trending: [],
    featured: [],
    latest: [],
    environment: [],
    sustainable: [],
    interviews: [],
    spotlight: [],
  });

  const [activeArticle, setActiveArticle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const fetchAllArticles = useCallback(async () => {
    try {
      // Create an array of all the categories we need to fetch
      const categories = [
        { key: "trending", tag: "Trending" },
        { key: "featured", tag: "featured" },
        { key: "latest", tag: "latest" },
        { key: "environment", tag: "Environment" },
        { key: "sustainable", tag: "Sustainable_Living" },
        { key: "interviews", tag: "Interviews" },
        { key: "spotlight", tag: "Spotlight" },
      ];

      // Fetch all categories in parallel
      const requests = categories.map(({ key, tag }) =>
        axios
          .get(`https://api.thatgreymatter.com/api/articles/home/${tag}`)
          .then((res) => ({ key, data: res.data.data }))
          .catch((err) => {
            console.error(`Error fetching ${key}:`, err);
            return { key, data: [] };
          })
      );

      const results = await Promise.all(requests);

      // Update state with all fetched data
      const newArticles = { ...articles };
      const newLoading = { ...loading };

      results.forEach(({ key, data }) => {
        newArticles[key] = data;
        newLoading[key] = false;
      });

      setArticles(newArticles);
      setLoading(newLoading);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllArticles();
  }, [fetchAllArticles]);

  const handleNext = useCallback(() => {
    if (isTransitioning || articles.featured.length <= 1) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveArticle((prev) => (prev + 1) % articles.featured.length);
      setIsTransitioning(false);
    }, 500);
  }, [articles.featured.length, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || articles.featured.length <= 1) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveArticle(
        (prev) =>
          (prev - 1 + articles.featured.length) % articles.featured.length
      );
      setIsTransitioning(false);
    }, 500);
  }, [articles.featured.length, isTransitioning]);

  const handleSubscribeClick = async (e) => {
    e.preventDefault();

    // Use the ngrok URL directly - NOT localhost
    const rssFeedUrl = "https://api.thatgreymatter.com/api/rss/feed";

    console.log("Using RSS URL:", rssFeedUrl);

    try {
      // Test if RSS feed is accessible
      const response = await fetch(rssFeedUrl);
      if (!response.ok) {
        throw new Error(`RSS feed returned status: ${response.status}`);
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(rssFeedUrl);
      
      // Show success toast
      toast.success('RSS Feed URL copied to clipboard!', {
        duration: 4000,
        position: 'bottom-right',
        icon: '📋',
        style: {
          background: '#10b981',
          color: 'white',
        },
      });

      // Open Feedly with the NGrok URL (not localhost)
      // const feedlyUrl = `https://feedly.com/i/subscription/feed/${encodeURIComponent(
      //   rssFeedUrl
      // )}`;
      // console.log("Opening Feedly with URL:", feedlyUrl);
      // window.open(feedlyUrl, "_blank", "noopener,noreferrer");

    } catch (err) {
      console.error("RSS Feed Error:", err);
      console.log(`Cannot access RSS feed: ${err.message}`);
      
      // Show error toast
      toast.error('Failed to copy RSS feed URL', {
        duration: 4000,
        position: 'bottom-right',
        icon: '❌',
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
      
      window.open("https://feedly.com/i/welcome", "_blank");
    }
  };

  useEffect(() => {
    if (!autoRotate || articles.featured.length <= 1) return;

    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoRotate, articles.featured.length, handleNext]);

  const handleSeeMoreTrending = () => {
    navigate("/trending");
  };

  const handleFeaturedMouseEnter = () => {
    setAutoRotate(false);
  };

  const handleFeaturedMouseLeave = () => {
    setAutoRotate(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-10 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen bg-gray-100 dark:bg-custom-dark dark:text-gray-100">
      {/* React Hot Toast Container */}
      <Toaster 
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#ffffff',
          },
        }}
      />

      {/* Banner Section Top */}
      <div className="w-full -mt-2 sm:-mt-3 lg:-mt-5 mb-4 sm:mb-5">
        <OptimizedImage
          src="./dark.png"
          alt="Sustainable living in dark mode"
          className="w-full h-auto max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56 rounded-xl sm:rounded-2xl object-cover"
          priority={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 sm:gap-5">
        {/* Trending News Section */}
        <div className="lg:col-span-3 bg-white dark:bg-custom-dark p-4 sm:p-6 hidden lg:block border:none rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-lg font-semibold text-gray-800 dark:text-gray-100 -mt-5">
              Trending
            </h2>
            <Button
              variant="ghost"
              onClick={handleSeeMoreTrending}
              className="text-custom-green hover:text-custom-green-1 dark:text-custom-green dark:hover:text-custom-green-1 group"
              aria-label="See more trending articles"
            >
              See More{" "}
              <MdArrowForward className="ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          {loading.trending ? (
            <div className="flex flex-col gap-8">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="space-y-2 animate-pulse">
                  <Skeleton className="h-6 w-full bg-gray-300" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-gray-300" />
                    <Skeleton className="h-4 w-20 bg-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-8">
              {articles.trending?.slice(0, 7).map((article, index) => (
                <div key={index} className="gap-8 group">
                  <Card
                    className="hover:shadow-lg transition-all duration-300 hover:bg-custom-green-1/10 dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black group-hover:scale-[1.02]"
                    aria-label={`Trending article: ${article.title}`}
                  >
                    <div
                      onClick={() =>
                        navigate(article.link || `/articles/${article._id}`)
                      }
                    >
                      <CardHeader className="p-3 sm:p-4">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 hover:underline line-clamp-2 dark:text-gray-100 transition-all">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0 flex justify-between items-center">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${article.author?._id}`);
                          }}
                          className="text-xs sm:text-sm font-semibold text-teal-700 hover:underline hover:text-teal-800 dark:hover:text-teal-500 cursor-pointer transition-colors"
                        >
                          {article.author?.name || article.author || "Unknown"}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-teal-700">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              ))}
            </ul>
          )}
        </div>

        {/* Middle Section */}
        <div className="lg:col-span-6">
          {/* Featured News Section */}
          <div
            className="relative h-[300px] sm:h-[350px] lg:h-[450px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group"
            onMouseEnter={handleFeaturedMouseEnter}
            onMouseLeave={handleFeaturedMouseLeave}
          >
            {loading.featured ? (
              <Skeleton className="w-full h-full rounded-xl animate-pulse bg-gray-300" />
            ) : articles.featured.length > 0 ? (
              <>
                <div className="relative w-full h-full overflow-hidden">
                  {articles.featured.map((article, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === activeArticle ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <OptimizedImage
                        src={article.bannerImage}
                        alt={article.title}
                        className="w-full h-full"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 text-white space-y-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide rounded-full bg-custom-green text-white transition-colors">
                    Featured
                  </span>

                  <div
                    onClick={() =>
                      navigate(
                        articles.featured[activeArticle]?.link ||
                          `/articles/${articles.featured[activeArticle]?._id}`
                      )
                    }
                    className="cursor-pointer"
                  >
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight hover:underline transition-all">
                      {articles.featured[activeArticle]?.title ||
                        "Featured Article"}
                    </h3>
                    <p className="text-sm sm:text-base mt-2 line-clamp-2 opacity-90">
                      {articles.featured[activeArticle]?.excerpt ||
                        articles.featured[activeArticle]?.description ||
                        ""}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm sm:text-base">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (articles.featured[activeArticle]?.author?._id) {
                          navigate(
                            `/profile/${articles.featured[activeArticle].author._id}`
                          );
                        }
                      }}
                      className="font-medium text-custom-green hover:underline cursor-pointer transition-colors"
                    >
                      By{" "}
                      {articles.featured[activeArticle]?.author?.name ||
                        articles.featured[activeArticle]?.author ||
                        "Unknown"}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-300">
                      {new Date(
                        articles.featured[activeArticle]?.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Navigation arrows */}
                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous article"
                  >
                    <MdNavigateBefore size={32} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next article"
                  >
                    <MdNavigateNext size={32} />
                  </button>
                </div>

                {/* Indicator dots */}
                {articles.featured.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {articles.featured.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveArticle(index)}
                        className={`w-2 h-2 rounded-full transition-all focus:outline-none ${
                          index === activeArticle
                            ? "bg-custom-green w-4"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-custom-dark">
                <p className="text-gray-500 dark:text-gray-400">
                  No featured articles available
                </p>
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
                : articles.latest
                    .slice(0, 4)
                    .map((article, index) => (
                      <ArticleCard
                        key={index}
                        article={article}
                        loading={false}
                        priority={index < 2}
                      />
                    ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Contact Us Card */}
          <div className="rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 h-[250px] sm:h-[300px] lg:h-[400px] bg-custom-green-1 transition-all hover:shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-800 mb-10 dark:text-gray-800">
              Got a story or suggestion? <br /> We'd love to hear from you!
            </p>
            <Link to="/contact">
              <Button
                variant="primary"
                className="w-full rounded-full bg-custom-green text-custom-green-1 hover:scale-105 mt-6 lg:mt-36 font-bold transition-transform focus:outline-none focus:ring-2 focus:ring-custom-green focus:ring-offset-2"
                aria-label="Contact us"
              >
                Contact Us
                <MdNavigateNext
                  size={24}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </Link>
          </div>

          {/* Subscribe Card */}
          <div className="rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 h-[250px] sm:h-[300px] bg-custom-green transition-all hover:shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-3">
              Subscribe
            </h2>
            <p className="text-gray-200 mb-10">
              Stay updated with our latest articles. <br />
              Subscribe to our RSS feed now!
            </p>
            <Button
              onClick={handleSubscribeClick}
              variant="primary"
              className="w-full rounded-full bg-custom-accent-green text-custom-green hover:scale-105 font-bold transition-transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 mt-6 group"
              aria-label="Subscribe to RSS feed"
            >
              Subscribe
              <MdRssFeed
                size={24}
                className="ml-2 transition-transform group-hover:scale-110"
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full mt-10">
        <OptimizedImage
          src="./Grey Matter.png"
          alt="Discover more eco-friendly content"
          className="w-auto h-auto object-cover"
          priority={false}
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
        articles={articles.spotlight}
        loading={loading.spotlight}
        genre="Spotlight"
      />
      <Section
        title="Environment"
        articles={articles.environment}
        loading={loading.environment}
        genre="Environment"
      />
      <Section
        title="Sustainable Living"
        articles={articles.sustainable}
        loading={loading.sustainable}
        genre="Sustainable_Living"
      />
      <Section
        title="Interviews"
        articles={articles.interviews}
        loading={loading.interviews}
        genre="Interviews"
      />
    </div>
  );
};

export default memo(Home);