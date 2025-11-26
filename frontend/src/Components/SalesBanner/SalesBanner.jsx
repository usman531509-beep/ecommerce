import React, { useState, useEffect } from 'react';
import ring from "../Assests/ringss.webp"; // Placeholder image path
// This component uses a timer state to simulate a live countdown
const SalesBanner = () => {
  // Initial time: 12 hours and 20 minutes in seconds
  const initialTimeInSeconds = 12 * 3600 + 20 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);

  useEffect(() => {
    // If time is 0 or less, stop the timer
    if (timeLeft <= 0) return;

    // Set up the interval for the countdown
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000); // Update every second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Function to format seconds into Hours and Mins
  const getFormattedTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    
    // Add leading zero if needed
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    
    return { paddedHours, paddedMinutes };
  };

  const { paddedHours, paddedMinutes } = getFormattedTime();

  return (
    // FIX: Removed 'flex justify-center' from the outermost div and ensured it is w-full.
    <div className="p-4 md:px-8 font-sans w-full" style={{marginBottom: '60px'}}> 
      
      {/* Banner Container - This div uses w-full and responsive padding inside */}
      <div 
        className="w-full flex items-center justify-between overflow-hidden rounded-2xl shadow-2xl p-6 sm:p-10 relative"
        // Custom Tailwind styles for the soft orange/pink gradient background
        style={{
          background: 'linear-gradient(90deg, #FFECD2 0%, #FCB69F 100%)',
        }}
      >
        {/* Left Content Area (Text and Button) */}
        <div className="flex-1 min-w-0 z-10 p-2 sm:p-0">
          
          {/* Main Offer Text */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4" style={{ color: '#F76B1C' }}>
            FLAT 50% OFF
          </h2>

          {/* Countdown Timer */}
          <div className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
            {timeLeft > 0 ? (
              <>
                <span className="text-2xl sm:text-3xl text-gray-900">{paddedHours}</span> Hours 
                <span className="ml-3 text-2xl sm:text-3xl text-gray-900">{paddedMinutes}</span> Mins
              </>
            ) : (
              <span className="text-red-600">Sale Ended!</span>
            )}
          </div>

          {/* Explore Button */}
          <button 
            className="px-8 py-3 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105"
            style={{ 
              background: '#FF6B2C', // Bright orange color for the button
              boxShadow: '0 4px 15px rgba(255, 107, 44, 0.4)'
            }}
          >
            Explore now
          </button>
        </div>

        {/* Right Image Area (Headphone) - Responsive positioning */}
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-1/3 md:w-2/5 lg:w-1/3 h-full">
            <img 
              // Using a placeholder image for a white headphone
              src={ring}
              alt="White Wireless Headphones"
              className="object-cover w-full h-full object-right scale-[1.2] opacity-90 transition duration-500 hover:scale-[1.3]"
              // Fallback in case the image doesn't load
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x200/ffefef/999?text=Product+Image"; }}
            />
        </div>
        
        {/* Small screen image fallback (optional, can be removed if not needed) */}
        <div className="sm:hidden w-1/3 flex justify-end items-center">
             <img 
              src="https://placehold.co/100x100/ffefef/999?text=🎧" 
              alt="Headphone Icon"
              className="w-20 h-20 object-contain"
            />
        </div>

      </div>
    </div>
  );
};

export default SalesBanner;