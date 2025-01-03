import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white py-10">
      <div className="container mx-auto text-center space-y-7">
        <div>
          <Link to="/">  
          <img
            src="./logo2.png"
            alt="Logo"
            className="w-50 h-20 mx-auto transition-transform transform hover:scale-105 cursor-pointer"
          />
          </Link>
        </div>

        <div className="flex justify-center space-x-8 text-gray-700 text-xl font-medium">
          <Link
            to="/privacy-policy"
            className="group relative cursor-pointer transition-colors duration-300 hover:text-gray-600"
          >
            Privacy Policy
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
          <Link
            to="/terms-of-use"
            className="group relative cursor-pointer transition-colors duration-300 hover:text-gray-600"
          >
            Terms of Use
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
          <Link
            to="/contact"
            className="group relative cursor-pointer transition-colors duration-300 hover:text-gray-600"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
        </div>

        <p className="text-gray-700 text-lg">
          &copy; 2025 Grey Matter.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
