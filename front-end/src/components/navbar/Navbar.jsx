import React, { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ["Featured", "Environment", "News", "Science", "Technology"];

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

          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="./logo2.png"
                alt="Logo"
                className="h-8 md:h-12 w-auto transition-transform hover:scale-105"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="relative text-base lg:text-lg text-gray-900 hover:text-gray-600 transition-colors duration-300 group"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </div>

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
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-lg py-2 text-gray-900 hover:text-gray-600 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
