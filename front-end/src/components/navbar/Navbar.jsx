import React, { useState } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Trending", link: "/featured" },
    { name: "News", link: "/news" },
    {
      name: "Nature",
      dropdown: [
        { name: "Environment", link: "/environment" },
        { name: "Weather", link: "/weather" },
        { name: "Agriculture", link: "/agriculture" },
        { name: "Forest", link: "/forest" },
        { name: "Sustainable Living", link: "/sustainable-living" },
      ],
    },
    {
      name: "Innovation",
      dropdown: [
        { name: "Science And Research", link: "/science-and-research" },
        { name: "Startups And Entrepreneurship", link: "startups-and-entrepreneurship" },
        { name: "Technology And Advancement", link: "/technology-and-advancement" },
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

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-900 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="./logo2.png"
                alt="Logo"
                className="h-8 md:h-12 w-auto transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="relative group">
                  <button className="flex items-center text-base lg:text-lg text-gray-900 hover:text-gray-600 transition-colors duration-300">
                    {item.name}
                    <ChevronDown
                      size={16}
                      className="ml-1 transition-transform group-hover:rotate-180"
                    />
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                    {item.dropdown.map((option) => (
                      <Link
                        key={option.name}
                        to={option.link}
                        className="block px-4 py-2 text-gray-900 hover:bg-gray-300 "
                      >
                        {option.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.link}
                  className="relative text-base lg:text-lg text-gray-900 hover:text-gray-600 transition-colors duration-300 group"
                >
                  {item.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
              )
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center max-w-xs flex-1 ml-4">
            <div className="w-full flex items-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent py-2 px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between">
              <img src="./logo2.png" alt="Logo" className="h-8 w-auto" />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-900 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mt-6 mb-8">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button className="p-3 text-gray-600">
                  <Search size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.name} className="space-y-2">
                    <span className="font-semibold">{item.name}</span>
                    {item.dropdown.map((option) => (
                      <Link
                        key={option.name}
                        to={option.link}
                        className="block text-gray-900 hover:text-gray-600 transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        {option.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="text-lg py-2 text-gray-900 hover:text-gray-600 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
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
