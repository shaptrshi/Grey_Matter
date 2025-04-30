import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo2.png";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-custom-dark py-6 sm:py-8 md:py-10 mt-6 sm:mt-8 md:mt-10 border-t border-gray-300 dark:border-black shadow-md">
      <div className="container mx-auto px-4 text-center space-y-4 sm:space-y-6 md:space-y-7">
        {/* Logo Section */}
        <div className="w-full max-w-[200px] mx-auto">
          <Link to="/">
            <img
              src= {logo}
              alt="Logo"
              className="w-32 h-16 sm:w-40 sm:h-16 md:w-50 md:h-20 mx-auto transition-transform transform hover:scale-105 cursor-pointer object-contain"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
        <Link
            to="/aboutus"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-base sm:text-lg md:text-xl font-medium"
          >
            About Us
          </Link>
          <Link
            to="/privacy-policy"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-base sm:text-lg md:text-xl font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-use"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-base sm:text-lg md:text-xl font-medium"
          >
            Terms of Use
          </Link>
          <Link
            to="/contact"
            className="group relative cursor-pointer transition-colors duration-300 dark:hover:text-custom-green hover:text-custom-green text-gray-700 dark:text-gray-100 text-base sm:text-lg md:text-xl font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright Text */}
        <p className="text-gray-700 text-center dark:text-gray-100 text-sm">&copy; {new Date().getFullYear()} Grey Matter. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;