import React from "react";
import { Link } from "react-router-dom";
import arrow_icon from "../Assests/breadcrum_arrow.png";

const Breadcrum = ({ product }) => {
  return (
    <div  className="w-full bg-gradient-to-r from-pink-50 via-white to-pink-50 py-3 px-4 sm:px-8 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm sm:text-base font-medium text-gray-600 shadow-sm">
      <Link
        to="/"
        className="hover:text-red-500 transition-colors duration-300 flex items-center gap-1"
      > 
        Home
      </Link>
      <img src={arrow_icon} alt=">" className="w-3 sm:w-4 opacity-60" />
      <Link
        to="/"
        className="hover:text-red-500 transition-colors duration-300 flex items-center gap-1"
      >
        Shop
      </Link>
      <img src={arrow_icon} alt=">" className="w-3 sm:w-4 opacity-60" />
      <Link
        to={`/${product?.category.name}`}
        className="capitalize flex items-center gap-1 hover:text-red-500 transition-colors duration-300"
      >
        {product?.category.name}
      </Link>
      <img src={arrow_icon} alt=">" className="w-3 sm:w-4 opacity-60" />
      <span className="truncate max-w-[150px] sm:max-w-none text-gray-800 font-semibold">
        {product?.name}
      </span>
    </div>
  );
};

export default Breadcrum;
