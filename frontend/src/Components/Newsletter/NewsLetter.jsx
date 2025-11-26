import React from "react";

const NewsLetter = () => {
  return (
    <section className="w-[90%] sm:w-[80%] lg:w-[65%] mx-auto flex flex-col items-center justify-center gap-6 sm:gap-8 bg-gradient-to-b from-pink-100 to-emerald-50 rounded-3xl py-12 sm:py-16 px-6 sm:px-10 mt-16 mb-24 shadow-md text-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-700 leading-tight">
        Get Exclusive Offers On Your Email
      </h1>

      <p className="text-gray-600 text-base sm:text-lg">
        Subscribe to our newsletter and stay updated
      </p>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-full shadow-sm w-full sm:w-[600px] lg:w-[730px] overflow-hidden mt-4">
        <input
          type="email"
          placeholder="Your Email ID"
          className="flex-1 px-6 py-3 sm:py-4 text-gray-600 placeholder-gray-400 text-base focus:outline-none"
        />
        <button className="w-full sm:w-[180px] lg:w-[210px] py-3 sm:py-4 bg-black text-white text-base sm:text-lg font-medium rounded-full hover:bg-gray-800 active:bg-gray-900 transition-all duration-300">
          Subscribe
        </button>
      </div>
    </section>
  );
};

export default NewsLetter;
