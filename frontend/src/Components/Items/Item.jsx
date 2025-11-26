import React from "react";
import { Link } from "react-router-dom";

const Item = (props) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2">
      {/* Product Image */}
      <Link
        to={`/product/${props.id}`}
        className="block bg-gray-50 flex items-center justify-center"
      >
        <img
          src={props.image}
          alt={props.name}
          className="max-h-64 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 text-center flex flex-col items-center gap-2">
        <h3 className="text-gray-800 font-semibold text-lg text-center">
          {props.name}
        </h3>
        <p className="text-gray-500 text-sm text-center line-clamp-2">
          {props.description || "High-quality product at the best price."}
        </p>

        {/* Prices */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-red-500 font-bold text-lg">
            Rs {props.new_price}
          </span>
          <span className="text-gray-400 line-through text-sm">
            Rs {props.old_price}
          </span>
        </div>

        {/* Button */}
        <Link
          to={`/product/${props.id}`}
          className="mt-4 inline-block px-5 py-2 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Item;
