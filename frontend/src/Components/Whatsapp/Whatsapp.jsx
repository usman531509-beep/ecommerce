import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const WhatsAppWidget = () => {
  const phoneNumber = "923037798802"; 
  const message = "Hello! I would like to inquire about your products."; 

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-0 z-[9999] flex items-end justify-end">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
       
        className="group relative flex items-center justify-center w-20 h-14 bg-[#25D366] text-white rounded-l-2xl shadow-[-5px_5px_15px_rgba(0,0,0,0.1)] transition-all duration-500 transform translate-x-12 hover:translate-x-0 active:scale-95 pl-2"
        aria-label="Chat on WhatsApp"
      >
       
        <span className="absolute inset-0 rounded-l-2xl bg-[#25D366] opacity-20 animate-ping group-hover:animate-none"></span>

       
        <div className="relative flex items-center gap-2 transition-transform duration-300 group-hover:-translate-x-1">
          <FontAwesomeIcon icon={faWhatsapp} className="text-3xl drop-shadow-md" />
         
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 uppercase tracking-tighter">
            Chat
          </span>
        </div>

        
        <span className="absolute right-full mr-4 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-xl min-w-max border border-white/10 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></div>
            Direct Inquiry
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 bg-gray-800 rotate-45"></div>
        </span>
      </a>
    </div>
  );
};

export default WhatsAppWidget;