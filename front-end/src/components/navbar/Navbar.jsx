import React from "react";

const Navbar = () => {
  return (
    <nav className="shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-10 py-5">
        <div className="flex items-center space-x-4">
          <img
            src="./logo.svg"
            alt="Logo"
            className=" border-gray-700 cursor-pointer"
          />
        </div>


        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a
            href="#featured"
            className="text-gray-800 hover:text-gray-400 transition-colors duration-200 text-xl"
          >
            Featured
          </a>
          <a
            href="#news"
            className="text-gray-800 hover:text-gray-400 transition-colors duration-200 cursor-pointer text-xl"
          >
            News
          </a>
          <a
            href="#science"
            className="text-gray-800 hover:text-gray-400 transition-colors duration-200 cursor-pointer text-xl"
          >
            Science
          </a>
          <a
            href="#technology"
            className="text-gray-800 hover:text-gray-400 transition-colors duration-200 cursor-pointer text-xl"
          >
            Technology
          </a>
        </div>

        <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden hover:bg-gray-300 transition-all duration-200 hover:shadow-lg">
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
