import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react"; 

const Item = (props) => {

  const discountPercentage = props.discountPercentage;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2 relative">
      {/* 💡 1. Discount Tag (Absolute Position) */}
      {discountPercentage && discountPercentage > 0 && (
        <div 
          className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full z-10 shadow-lg flex items-center space-x-1 animate-pulse"
          title={`Save ${discountPercentage}% on this item!`}
        >
            <Tag className="w-3 h-3"/>
            <span>{discountPercentage}% OFF</span>
        </div>
      )}

      {/* Product Image */}
      <Link
        to={`/product/${props.id}`}
        className="block bg-gray-50 flex items-center justify-center relative"
      >
        <img
          src={props.image}
          alt={props.name}
          className="max-h-64 w-auto object-contain group-hover:scale-105 transition-transform duration-500 p-4"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 text-center flex flex-col items-center gap-2">
        <h3 className="text-gray-800 font-semibold text-lg text-center line-clamp-1">
          {props.name}
        </h3>
        <p className="text-gray-500 text-sm text-center line-clamp-2 min-h-[40px]"> 
          {/* Minimum height added to prevent layout shift */}
          {props.description || "High-quality product at the best price."}
        </p>

        {/* Prices */}
        <div className="flex items-center gap-3 mt-2">
          {/* New Price (Discounted Price) */}
          <span className={`font-bold text-lg ${discountPercentage > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            Rs {props.new_price}
          </span>
          
          {/* Old Price (Strikethrough) - Only show if discount is present or old_price is greater */}
          {(props.old_price && props.old_price > props.new_price) && (
            <span className="text-gray-400 line-through text-sm">
              Rs {props.old_price}
            </span>
          )}
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