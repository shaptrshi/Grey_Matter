import React, { useState, useRef, useEffect, useContext } from "react";
import { Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import logo from "../../assets/logo.png";
import SearchBar from "../searchbar/searchBar";
import { Link, useNavigate } from "react-router-dom";

const Dropdown = ({ label, items, isDesktop, onItemClick = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-base font-bold lg:text-lg text-gray-900 dark:text-gray-100 hover:text-custom-green dark:hover:text-custom-green transition-colors duration-300 rounded-md"
      >
        {label}
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div
          className={`${
            isDesktop
              ? "absolute left-0 mt-2 w-48 bg-white dark:bg-custom-dark shadow-lg rounded-md z-50"
              : "mt-2 space-y-2"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className={`block ${
                isDesktop ? "px-4 py-2" : "py-2"
              } text-gray-900 hover:bg-custom-green-1 dark:text-gray-100 dark:hover:text-gray-800 transition-colors duration-300`}
              onClick={() => {
                setIsOpen(false);
                onItemClick();
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Trending", link: "/trending" },
    {
      name: "Geography",
      dropdown: [
        { name: "Environment", link: "/environment" },
        { name: "Weather", link: "/weather" },
        { name: "Agriculture", link: "/agriculture" },
        { name: "Sustainable Living", link: "/sustainable-living" },
      ],
    },
    {
      name: "Innovation",
      dropdown: [
        { name: "Artificial Intelligence", link: "/artificial-intelligence" },
        { name: "Science And Research", link: "/science-and-research" },
        {
          name: "Startups And Entrepreneurship",
          link: "/startups-and-entrepreneurship",
        },
        {
          name: "Technology And Advancement",
          link: "/technology-and-advancement",
        },
      ],
    },
    {
      name: "Focus",
      dropdown: [
        { name: "Evolving Horizons", link: "/evolving-horizons" },
        { name: "Interviews", link: "/interviews" },
        { name: "Policy And Governance", link: "/policy-and-governance" },
        { name: "Spotlight", link: "/spotlight" },
      ],
    },
  ];

  const handleSearchSubmit = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearchItemSelect = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-custom-dark shadow-md dark:shadow-sm dark:shadow-black">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-900 hover:bg-gray-100 dark:text-gray-100"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 pt-3 md:pt-5">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-16 md:h-24 w-auto transition-transform hover:scale-105 origin-center"
              />
            </Link>
          </div>

          {/* Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-grow space-x-6 lg:space-x-8">
            {navItems.map((item) =>
              item.dropdown ? (
                <Dropdown
                  key={item.name}
                  label={item.name}
                  items={item.dropdown}
                  isDesktop={true}
                />
              ) : (
                <Link
                  key={item.name}
                  to={item.link}
                  className="relative text-base font-bold lg:text-lg text-gray-900 dark:text-gray-100 dark:hover:text-custom-green hover:text-custom-green transition-colors duration-300"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-auto">
            <SearchBar
              onSearchSubmit={handleSearchSubmit}
              onItemSelect={handleSearchItemSelect}
              className="w-full"
            />
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-900 dark:text-gray-100 transition-transform hover:scale-105 duration-300 ml-2"
            aria-label="Toggle Dark Mode"
          >
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-custom-dark">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-900 hover:bg-gray-100 dark:text-gray-100"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mt-6 mb-8">
              <div className="w-full max-w-xs mx-auto">
                <SearchBar
                  onSearchSubmit={handleSearchSubmit}
                  onItemSelect={handleSearchItemSelect}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {navItems.map((item) =>
                item.dropdown ? (
                  <Dropdown
                    key={item.name}
                    label={item.name}
                    items={item.dropdown}
                    isDesktop={false}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                  />
                ) : (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="text-gray-900 hover:text-custom-green transition-colors duration-300 font-bold dark:text-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
