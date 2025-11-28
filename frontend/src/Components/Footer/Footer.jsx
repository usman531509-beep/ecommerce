import React from "react";
import { motion } from "framer-motion";
import footer_logo from "../Assests/logo.jpg";
import whatsapp from "../Assests/whatsapp-brands-solid.svg";
import instagram from "../Assests/instagram-brands-solid.svg";
import snap from "../Assests/snapchat-brands-solid.svg";
import atelier from "../Assests/atelier2.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#fff8f8] to-[#f8fafc] text-gray-700 pt-14 pb-6 px-6 md:px-12 font-[Poppins] overflow-hidden">
      {/* Floating blur effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-36 h-36 bg-pink-200 rounded-full blur-3xl opacity-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-44 h-44 bg-green-200 rounded-full blur-3xl opacity-40"
      />

      {/* Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 max-w-7xl mx-auto">
        {/* Logo & Description */}
        <div className="flex flex-col items-start">
          <motion.img
            src={atelier}
            alt="logo"
            className="w-40 mb-6"
            whileHover={{ rotate: 6 }}
          />
          <p className="text-sm text-gray-600 leading-relaxed max-w-[260px]">
            Your trusted destination for top-quality, affordable, and stylish
            accessories. <span className="font-semibold text-[#ff4141]">Atelier</span> Where shopping meets comfort.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-10 ">
            Categories
          </h3>
          <ul className="space-y-2 text-sm md:text-base">
            {["Shop", "Headphones", "Airpods", "Watches", "Power Banks"].map(
              (item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-[#ff4141] transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-10 ">
            Information
          </h3>
          <ul className="space-y-2 text-sm md:text-base">
            {["About Us", "Contact", "FAQs", "Privacy Policy", "Terms & Conditions"].map(
              (info, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-[#ff4141] transition-colors duration-200"
                  >
                    {info}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact + Socials */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-10">
            Connect With Us
          </h3>

          {/* Social Icons */}
          <div className="flex items-center gap-5 mb-5">
            {[whatsapp, instagram, snap].map((icon, i) => (
              <motion.img
                key={i}
                src={icon}
                alt="social"
                className="h-6 w-6 cursor-pointer hover:scale-125 transition-transform duration-300"
                whileHover={{ rotate: 10, scale: 1.2 }}
              />
            ))}
          </div>

          <div className="text-sm leading-relaxed">
            <a
              href="mailto:Usman531509@gmail.com"
              className="block hover:text-[#ff4141] transition"
            >
              📧 <span className="font-medium">Usman531509@gmail.com</span>
            </a>
            <a
              href="tel:+923037798802"
              className="block mt-1 hover:text-[#ff4141] transition"
            >
              📞 <span className="font-medium">+92 303 7798802</span>
            </a>
          </div>
        </div>
      </div>

      {/* Divider + Bottom Text */}
      <div className="mt-12 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
        © 2025{" "}
        <span className="font-semibold text-[#ff4141]">Atelier.com</span> — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
