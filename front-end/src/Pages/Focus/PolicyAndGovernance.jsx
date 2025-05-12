import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

const PolicyandGovernance = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchArticles = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/articles/genre/Policy_and_Governance?sort=${sort}&page=${currentPage}&limit=8`
      );
      setArticles(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch trending articles:", error);
    } finally {
      setLoading(false);
    }
  }, [sort, currentPage]);

  useEffect(() => {
    setLoading(true);
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="container mx-auto px-4 sm:px-10 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen bg-gray-100 dark:bg-custom-dark dark:text-gray-100">
      <div className="mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-10">
          Policy and Governance
        </h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Explore policies and governance frameworks that influence
          environmental and sustainability practices.
        </p>

        {/* Sort Dropdown */}
        <div className="flex justify-center sm:justify-end mb-6 px-4">
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value);
              setCurrentPage(1);
              fetchArticles();
            }}
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

        {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
         {[...Array(8)].map((_, i) => (
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
          <p className="text-center text-muted-foreground">
            No articles found.
          </p>
        ) : (
          <>
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
                            e.stopPropagation();
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

            {/* Modern Pagination */}
            {totalPages > 1 || articles.length > 0 ? (
              <div className="flex justify-center mt-16">
                <Pagination className="bg-white dark:bg-custom-dark p-4">
                  <PaginationContent className="flex gap-2">
                    {/* ← Prev */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        className="cursor-pointer py-2 px-3 rounded-lg text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark:text-gray-100 dark:hover:text-white"
                      >
                        ←
                      </PaginationLink>
                    </PaginationItem>

                    {/* Dynamic Pages */}
                    {(() => {
                      const pageNumbersToShow = 5;
                      let startPage = Math.max(
                        1,
                        currentPage - Math.floor(pageNumbersToShow / 2)
                      );
                      let endPage = startPage + pageNumbersToShow - 1;

                      if (endPage > totalPages) {
                        endPage = totalPages;
                        startPage = Math.max(
                          1,
                          endPage - pageNumbersToShow + 1
                        );
                      }

                      const pages = [];
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={i === currentPage}
                              onClick={() => setCurrentPage(i)}
                              className={`cursor-pointer py-2 px-4 rounded-lg transition-all ${
                                i === currentPage
                                  ? "bg-teal-500 text-white dark:bg-custom-dark"
                                  : "text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark:text-gray-100 dark:hover:text-white"
                              }`}
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return pages;
                    })()}

                    {/* → Next */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                        className="cursor-pointer py-2 px-3 rounded-lg text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-600 dark:text-gray-100 dark:hover:text-white"
                      >
                        →
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default PolicyandGovernance;
