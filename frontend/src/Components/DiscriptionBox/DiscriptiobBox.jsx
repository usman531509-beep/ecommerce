import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import parse from "html-react-parser";

const DescriptionBox = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const { API_BASE_URL } = useContext(ShopContext);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL }/api/reviews/product/${product._id}`
      );
      setReviews(res.data);
    } catch (err) {
      console.error("Review fetch error:", err);
    }
  };

  useEffect(() => {
    if (product?._id) {
      fetchReviews();
    }
  }, [product]);

  return (
    <div className="w-full bg-white px-5 sm:px-10 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Tabs */}
        <div className="flex items-center justify-center gap-4 border-b border-gray-200 pb-2">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "text-red-500 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-red-500"
                  : "text-gray-500 hover:text-red-400"
              }`}
            >
              {tab === "description"
                ? "Description"
                : `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8 text-gray-700 leading-relaxed">

          {activeTab === "description" ? (
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {product?.name}
              </h2>

              <p className="text-sm sm:text-base text-gray-700 overflow-hidden whitespace-pre-line break-words">
                {parse(product?.description ||
                  "Discover exceptional quality and modern design with this product. Crafted to deliver comfort, durability, and unmatched performance.")}
              </p>
            </div>
          ) : (
            
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Customer Reviews
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="border-b border-gray-200 pb-3 last:border-none"
                    >
                      <p className="font-semibold text-gray-800">
                        {rev.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        {"⭐".repeat(rev.rating)}{" "}
                        {"☆".repeat(5 - rev.rating)}
                      </p>

                      <p className="text-gray-700 mt-1">{rev.comment}</p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DescriptionBox;
