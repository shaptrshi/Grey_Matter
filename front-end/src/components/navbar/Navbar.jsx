import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="">
      <div className="container mx-auto flex items-center justify-between px-10 py-5">
        <div className="flex items-center space-x-4">
          <Link to="/">  
          <img
            src="./logo2.png"
            alt="Logo"
            className=" border-gray-700 cursor-pointer transition-transform transform hover:scale-105 w-48 h-19"
          />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {["Featured", "Environment", "News", "Science", "Technology"].map(
            (section) => (
              <Link
                key={section}
                to={`/${section.toLowerCase()}`}
                className="relative text-gray-900 hover:text-gray-600 transition-colors duration-300 text-xl group"
              >
                {section}
                <span className="absolute left-0 bottom-0 w-0 h-1 bg-gray-300 transition-all duration-550 ease-out group-hover:w-full"></span>
              </Link>
            )
          )}
        </div>


        <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden hover:bg-gray-300 transition-all duration-200 ease-out hover:shadow-lg">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 px-4 py-2 text-black placeholder-gray-500 focus:outline-none"
          />
          <button className=" p-3 flex items-center justify-center">
            <img src="./search.png" alt="" className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;