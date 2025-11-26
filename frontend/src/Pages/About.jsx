import React from "react";
import { motion } from "framer-motion";
import about_img from "../Components/Assests/about_img.jpg";
import team1 from "../Components/Assests/about_img copy.jpg";
import team2 from "../Components/Assests/about_img copy 2.jpg";
import team3 from "../Components/Assests/about_img copy 3.jpg";
import { FaStar } from "react-icons/fa";

const About = () => {
  return (
    <div className="font-[Poppins] bg-gradient-to-b from-[#fff0f7] to-[#e1ffea33] overflow-hidden">
      {/* 🌟 Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between py-20 md:py-24 px-6 sm:px-12 lg:px-24">
        {/* Background Animation */}
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full blur-3xl"
        />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left z-10 max-w-[600px]"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            About <span className="text-[#ff4141]">ShopEase</span>
          </h1>
          <p className="text-gray-600 mt-6 text-base sm:text-lg leading-relaxed">
            Welcome to <span className="font-semibold text-[#ff4141]">ShopEase</span>, your one-stop fashion & lifestyle destination.
            We believe shopping should be fun, fast, and effortless — that’s why we’re redefining how you shop online.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-[#ff4141]">10k+</h3>
              <p className="text-gray-700 text-sm sm:text-base">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-[#ff4141]">500+</h3>
              <p className="text-gray-700 text-sm sm:text-base">Products</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-[#ff4141]">24/7</h3>
              <p className="text-gray-700 text-sm sm:text-base">Support</p>
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center mt-12 md:mt-0 z-10"
        >
          <motion.img
            src={about_img}
            alt="About Us"
            className="w-[80%] md:w-[70%] max-w-[480px] rounded-3xl object-cover drop-shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* 🎯 Mission & Vision Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
        >
          Our <span className="text-[#ff4141]">Mission & Vision</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <h3 className="text-2xl font-semibold text-[#ff4141] mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To make online shopping accessible, affordable, and enjoyable for everyone.
              We strive to offer curated products that inspire confidence and self-expression.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <h3 className="text-2xl font-semibold text-[#ff4141] mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be a globally trusted e-commerce brand, known for quality, innovation,
              and exceptional customer satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 👥 Meet Our Team */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
        >
          Meet Our <span className="text-[#ff4141]">Team</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[{ img: team1, name: "Sarah Khan", role: "CEO" },
            { img: team2, name: "Ali Raza", role: "Marketing Head" },
            { img: team3, name: "Ayesha Malik", role: "Product Designer" }].map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-[#fff0f7] p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-[#ff4141]"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-[#ff4141] font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💬 Customer Reviews Carousel */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 text-center bg-gradient-to-b from-[#fff0f7] to-[#ffe1e1]">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
        >
          What Our <span className="text-[#ff4141]">Customers Say</span>
        </motion.h2>

        <div className="flex overflow-x-auto gap-6 scrollbar-hide px-2">
          {[1, 2, 3].map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="min-w-[300px] bg-white p-8 rounded-2xl shadow-md hover:shadow-lg"
            >
              <div className="flex justify-center mb-4 text-[#ff4141]">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                “Amazing experience! The quality is top-notch and delivery was super fast.”
              </p>
              <h4 className="font-semibold text-gray-800">— Customer {i + 1}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 Join Us CTA */}
      <section className="py-20 text-center bg-[#ff4141] text-white">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Join the <span className="text-yellow-200">ShopEase</span> Family Today!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg mb-8"
        >
          Sign up now to get exclusive deals, early access to sales, and the latest fashion updates.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-white text-[#ff4141] font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all"
        >
          Get Started
        </motion.button>
      </section>
    </div>
  );
};

export default About;
