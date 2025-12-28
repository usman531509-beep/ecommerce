import React from "react";
import exclusive_image from "../Assests/exclusive.png";

const Offers = () => {
  const handleScrollToNewCollection = () => {
    const section = document.getElementById("new-collection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section id="exclusive-offer" className="w-[90%] md:w-[80%] lg:w-[65%] mx-auto flex flex-col md:flex-row items-center justify-between bg-gradient-to-b from-pink-100 to-emerald-50 rounded-3xl px-6 sm:px-10 md:px-16 lg:px-24 py-12 mt-12 shadow-md overflow-hidden">
    
      <div className="flex-1 flex flex-col justify-center text-center md:text-left space-y-3 md:space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
          Exclusive
        </h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
          Offers
        </h1>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-red-500 tracking-wide">
          BEST PRICES
        </h3>

        <button onClick={handleScrollToNewCollection} className="w-52 sm:w-64 lg:w-72 h-14 lg:h-16 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold text-lg sm:text-xl transition-all duration-300 mt-4 mx-auto md:mx-0 shadow-md hover:shadow-lg">
          Check Now
        </button>
      </div>

     
      <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0">
        <img
          src={exclusive_image}
          alt="Exclusive Offer"
          className="w-70 sm:w-80 md:w-96 lg:w-[490px] drop-shadow-md hover:scale-105 transition-transform duration-500"
        />
      </div>
    </section>
  );
};

export default Offers;
