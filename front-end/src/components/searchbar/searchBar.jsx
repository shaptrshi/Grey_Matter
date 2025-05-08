import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast"; // Make sure to install this if not already

const SearchBar = ({
  onResults = () => {},
  onSearchSubmit = () => {},
  onItemSelect = () => {},
  placeholder = "Search",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // To track highlighted suggestion
  const abortControllerRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const debouncedQuery = useDebouncedValue(query, 300);

  const memoizedOnResults = useCallback(
    (results) => {
      onResults(results);
    },
    [onResults]
  );

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 300);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/articles/search?query=${encodeURIComponent(
            debouncedQuery
          )}`,
          { signal: abortControllerRef.current.signal }
        );
        const json = await res.json();
        const results = json.data || [];
        setSuggestions(results);
        setOpen(results.length > 0);
        memoizedOnResults(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const matched = suggestions.find(
        (item) => item.title.toLowerCase() === query.trim().toLowerCase()
      );
      if (matched) {
        navigate(`/articles/${matched._id}`);
      } else {
        toast.error("No matching article found");
      }
      onSearchSubmit(); // This will close the mobile menu in the Navbar
      setOpen(false);
    }
  };

  const handleSelect = useCallback(
    (item) => {
      setQuery(item.title);
      setOpen(false);
      setSuggestions([]);
      memoizedOnResults([item]);
      onItemSelect(); // This will close the mobile menu in the Navbar
      navigate(`/articles/${item._id}`);
    },
    [memoizedOnResults, navigate, onItemSelect]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
        setQuery(""); // Clear the search input when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.includes("/articles/")) {
      setQuery("");
      setSuggestions([]);
      setOpen(false);
    }
  }, [location.pathname]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === -1
          ? suggestions.length - 1
          : (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1); // Reset highlighted index on Escape
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <form
        onSubmit={handleSubmit}
        className={`w-full flex items-center bg-gray-200 dark:bg-gray-100 rounded-lg hover:bg-custom-green-1 dark:hover:bg-custom-green-1 transition-colors duration-200 ${className}`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(-1); // Reset highlighted index when typing
          }}
          onKeyDown={handleKeyDown} // Added keydown handler here
          placeholder={placeholder}
          className="w-full bg-transparent py-2 px-4 text-sm text-gray-900 dark:text-gray-900 placeholder-black focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-900"
          aria-label="Search"
        >
          <Search size={20} className={showLoading ? "animate-spin" : ""} />
        </button>
      </form>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-custom-dark shadow-lg rounded-md max-h-60 overflow-y-auto transition-all duration-300">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <div
                key={item._id}
                onClick={() => handleSelect(item)}
                className={`px-4 py-2 text-sm cursor-pointer ${
                  highlightedIndex === index
                    ? "bg-custom-green-1 dark:bg-custom-green-1 dark:text-black"
                    : "hover:bg-custom-green-1 dark:hover:bg-custom-green-1 dark:hover:text-black"
                }`}
              >
                {item.title}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              {debouncedQuery
                ? "No results found"
                : "Please enter a search term"}
            </div>
          )}
          {loading && suggestions.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
          )}
        </div>
      )}
    </div>
  );
};

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default React.memo(SearchBar);
