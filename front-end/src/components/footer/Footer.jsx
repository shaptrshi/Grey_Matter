import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-custom-dark py-3 sm:py-4 md:py-6 mt-4 sm:mt-6 md:mt-8 border-t border-gray-300 dark:border-black shadow-md">
      <div className="container mx-auto px-4 text-center space-y-3 sm:space-y-4 md:space-y-6">
        {/* Logo Section */}
        <div className="w-full max-w-[450px] mx-auto mb-3 sm:mb-4 md:mb-6">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="w-112 h-64 sm:w-128 sm:h-72 md:w-140 md:h-80 mx-auto transition-transform transform hover:scale-105 cursor-pointer object-contain"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
          <Link
            to="/aboutus"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-sm sm:text-base md:text-lg font-medium"
          >
            About Us
          </Link>
          <Link
            to="/privacy-policy"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-sm sm:text-base md:text-lg font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-use"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-sm sm:text-base md:text-lg font-medium"
          >
            Terms of Use
          </Link>
          <Link
            to="/contact"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-sm sm:text-base md:text-lg font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright Text */}
        <p className="text-gray-700 text-center dark:text-gray-100 text-xs sm:text-sm md:text-base">
          &copy; {new Date().getFullYear()} That Grey Matter. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
