import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 8;
const DEFAULT_SORT = "latest";

const PolicyandGovernance = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || DEFAULT_SORT;

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/articles/genre/Policy_and_Governance`,
        {
          params: {
            sort,
            page: currentPage,
            limit: PAGE_SIZE,
          },
        }
      );
      setArticles(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch trending articles:", err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [sort, currentPage]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleSortChange = useCallback(
    (value) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("sort", value);
      newParams.set("page", "1");
      navigate(`?${newParams.toString()}`, { replace: true });
    },
    [navigate, searchParams]
  );

  const handlePageChange = useCallback(
    (page) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(page));
      navigate(`?${newParams.toString()}`, { replace: true });
    },
    [navigate, searchParams]
  );

  const handleArticleClick = useCallback(
    (id) => {
      navigate(`/articles/${id}`);
    },
    [navigate]
  );

  const handleAuthorClick = useCallback(
    (e, id) => {
      e.stopPropagation();
      navigate(`/profile/${id}`);
    },
    [navigate]
  );

  // Memoized article cards to prevent unnecessary re-renders
  const articleCards = useMemo(
    () =>
      articles.map((article) => (
        <div
          key={article._id}
          onClick={() => handleArticleClick(article._id)}
          className="cursor-pointer"
          role="article"
          aria-label={`Article: ${article.title}`}
        >
          <Card className="hover:shadow-md transition-transform transform hover:scale-105 p-2 h-[280px] sm:h-[300px] dark:bg-custom-dark dark:border-none dark:shadow-sm dark:shadow-black">
            <div className="relative h-[150px] sm:h-[150px]">
              <img
                src={article.bannerImage || "/default-image.jpg"}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                loading="lazy"
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
                  onClick={(e) => handleAuthorClick(e, article.author?._id)}
                  className="font-semibold text-teal-700 hover:underline"
                  aria-label={`View articles by ${
                    article.author?.name || "Unknown"
                  }`}
                >
                  {article.author?.name || "Unknown"}
                </button>
                <time
                  dateTime={new Date(article.createdAt).toISOString()}
                  className="font-semibold text-teal-700"
                >
                  {new Date(article.createdAt).toLocaleDateString()}
                </time>
              </div>
            </CardContent>
          </Card>
        </div>
      )),
    [articles, handleArticleClick, handleAuthorClick]
  );

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
            className={`cursor-pointer py-2 px-4 rounded-lg transition-all ${
              pageNum === currentPage
                ? "bg-teal-500 text-white dark:bg-custom-dark"
                : "text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark:text-gray-100 dark:hover:text-white"
            }`}
            aria-label={`Go to page ${pageNum}`}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      );
    });
  }, [totalPages, currentPage, handlePageChange]);

  return (
    <div className="container mx-auto px-4 sm:px-10 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen bg-gray-100 dark:bg-custom-dark dark:text-gray-100">
      <div className="mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
          Policy And Governance
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Explore policies and governance frameworks that influence
          environmental and sustainability practices.
        </p>

        {/* Sort Dropdown */}
        <div className="flex justify-center sm:justify-end mb-6 px-4">
          <Select
            value={sort}
            onValueChange={handleSortChange}
            aria-label="Sort articles by"
          >
            <SelectTrigger
              className="w-[220px] bg-white dark:bg-custom-dark text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 flex justify-between items-center py-2 px-4 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-custom-dark text-gray-800 dark:text-white rounded-lg shadow-lg">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <div className="text-center text-red-500 py-10">
            {error}
            <button
              onClick={fetchArticles}
              className="ml-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              aria-label="Retry loading articles"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(PAGE_SIZE)].map((_, i) => (
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
        ) : articles.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No articles found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {articleCards}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <Pagination className="bg-white dark:bg-custom-dark p-4">
                  <PaginationContent className="flex gap-2">
                    {/* Previous Page */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className={`cursor-pointer py-2 px-3 rounded-lg text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark:text-gray-100 dark:hover:text-white ${
                          currentPage <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        aria-label="Previous page"
                      >
                        ←
                      </PaginationLink>
                    </PaginationItem>

                    {/* Page Numbers */}
                    {paginationItems}

                    {/* Next Page */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className={`cursor-pointer py-2 px-3 rounded-lg text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark:text-gray-100 dark:hover:text-white ${
                          currentPage >= totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        aria-label="Next page"
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
  );
};

export default React.memo(PolicyandGovernance);
