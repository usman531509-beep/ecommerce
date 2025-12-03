import React from "react";
import { motion } from "framer-motion";
import about_img from "../Components/Assests/about_img.jpg";
import team1 from "../Components/Assests/about_img copy.jpg";
import team2 from "../Components/Assests/about_img copy 2.jpg";
import team3 from "../Components/Assests/about_img copy 3.jpg";
import { FaStar } from "react-icons/fa";
import { Clock, Users, Zap, Award, Gem, LayoutGrid } from "lucide-react"; 

const PRIMARY_TEXT = "text-gray-900";
const ACCENT_COLOR = "text-[#ff4141]"; 
const BACKGROUND_LIGHT = "bg-[#fff0f7]";

const About = () => {
  return (
   
    <div className="font-[Poppins] bg-white overflow-hidden pt-16 bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22]">
      
     
      <section className="relative flex flex-col md:flex-row items-center justify-between py-24 md:py-36 px-6 sm:px-12 lg:px-24">
        
      
        <motion.div
          animate={{ rotate: 10, scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute top-20 right-0 w-80 h-80 bg-pink-100 rounded-tl-[100px] blur-3xl opacity-70"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left z-10 max-w-[650px]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">
            Founded on Craftsmanship
          </p>
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-light ${PRIMARY_TEXT} leading-tight`}>
            Defining Modern <span className="font-medium">Elegance at Atelier</span>
          </h1>
          <p className={`${PRIMARY_TEXT} mt-8 text-base sm:text-lg leading-relaxed max-w-lg`}>
            <span className={`font-semibold ${ACCENT_COLOR.replace('text-', '')}`}>Atelier</span> is more than a retailer; it’s a commitment to refined living. We meticulously source and curate high calibre accessories from precision rings to exclusive jewelry ensuring every piece embodies luxury, quality, and enduring style.
          </p>
        </motion.div>

        {/* Image - Clean and High Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center mt-16 md:mt-0 z-10"
        >
          <img
            src={about_img}
            alt="Atelier Product Showcase"
            className="w-[85%] md:w-[70%] max-w-[550px] aspect-[4/5] object-cover rounded-xl shadow-2xl border-4 border-white"
          />
        </motion.div>
      </section>

      
      <section className={`py-24 px-6 sm:px-12 lg:px-24 text-center`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-3xl md:text-4xl font-light ${PRIMARY_TEXT} mb-16`}
        >
          Our <span className="font-medium">Pillars</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* Pillar 1: Craftsmanship */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(255, 65, 65, 0.1)" }}
            className="p-8 rounded-lg bg-white border border-gray-100 transition duration-300 shadow-md"
          >
            <Gem size={32} className={`mx-auto mb-4 ${ACCENT_COLOR}`} />
            <h3 className={`text-xl font-medium ${PRIMARY_TEXT} mb-2`}>Unrivalled Craftsmanship</h3>
            <p className="text-gray-600 text-sm">
              Every item is selected for its superior finish, material quality, and meticulous attention to detail.
            </p>
          </motion.div>

          {/* Pillar 2: Timelessness */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(255, 65, 65, 0.1)" }}
            className="p-8 rounded-lg bg-white border border-gray-100 transition duration-300 shadow-md"
          >
            <Clock size={32} className={`mx-auto mb-4 ${ACCENT_COLOR}`} />
            <h3 className={`text-xl font-medium ${PRIMARY_TEXT} mb-2`}>Enduring Design</h3>
            <p className="text-gray-600 text-sm">
              We focus on classic aesthetics that transcend fleeting trends, offering pieces with long-term value.
            </p>
          </motion.div>

          {/* Pillar 3: Exclusivity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(255, 65, 65, 0.1)" }}
            className="p-8 rounded-lg bg-white border border-gray-100 transition duration-300 shadow-md"
          >
            <Award size={32} className={`mx-auto mb-4 ${ACCENT_COLOR}`} />
            <h3 className={`text-xl font-medium ${PRIMARY_TEXT} mb-2`}>Curated Exclusivity</h3>
            <p className="text-gray-600 text-sm">
              Our collection is carefully curated, ensuring you have access to items that are truly distinctive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 👥 Meet Our Leadership */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-3xl md:text-4xl font-light ${PRIMARY_TEXT} mb-12`}
        >
          Meet Our <span className="font-medium">Founders & Leadership</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[{ img: team1, name: "Zara Sheikh", role: "Creative Director" },
            { img: team2, name: "Fahad Jameel", role: "Chief Design Officer" },
            { img: team3, name: "Hina Ali", role: "Head of Global Sourcing" }].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-xl transition"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-80 object-cover mb-4 rounded-lg shadow-xl border-b-4 border-transparent hover:border-[#ff4141] transition duration-300" // Added hover effect
              />
              <h3 className={`text-xl font-medium ${PRIMARY_TEXT}`}>{member.name}</h3>
              <p className={`${ACCENT_COLOR} font-medium text-sm mt-1 uppercase tracking-wider`}>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/*Customer Accolades (Updated design for visual interest) */}
      <section className={`py-24 px-6 sm:px-12 lg:px-24 text-center ${BACKGROUND_LIGHT}`}>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-3xl md:text-4xl font-light ${PRIMARY_TEXT} mb-16`}
        >
          Accolades from Our <span className="font-medium">Global Patrons</span>
        </motion.h2>

        <div className="flex overflow-x-auto gap-8 scrollbar-hide pb-4 max-w-full mx-auto">
          {[
            { quote: "The definition of luxury online shopping. The quality of my watch is truly unmatched.", name: "Aisha M." },
            { quote: "Impeccable packaging and a timeless design. Atelier delivers sophistication.", name: "Rizwan B." },
            { quote: "Highly curated pieces. Every purchase feels special and exclusive. A premium experience.", name: "Zain S." },
            { quote: "Seamless service and products that speak for themselves. This is true high-end retail.", name: "Fariha N." },
          ].map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`min-w-[320px] max-w-[350px] bg-white p-8 rounded-xl shadow-xl border-b-4 border-gray-200 hover:shadow-2xl transition duration-300 hover:border-b-4 hover:border-[#ff4141]`} // Added accent hover effect
            >
              <LayoutGrid size={24} className={`mb-4 ${ACCENT_COLOR} mx-auto`} />
              <div className="flex justify-center mb-4 text-yellow-500">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} className="w-4 h-4" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                “{review.quote}”
              </p>
              <h4 className={`font-semibold ${PRIMARY_TEXT} text-base`}>— {review.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* to Action (CTA) */}
      <section className={`py-20 text-center bg-[#ff4141] text-white`}> 
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-light mb-6 tracking-wide"
        >
          Discover the World of <span className="font-medium text-white">Atelier</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg mb-8 opacity-90"
        >
          Explore the curated selection of high-end accessories designed for elegance and legacy.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
          whileTap={{ scale: 0.95 }}
          className={`px-12 py-4 text-[#ff4141] bg-white font-bold tracking-widest uppercase rounded-full shadow-lg transition-all border-2 border-white`}
        >
          Explore Collections
        </motion.button>
      </section>
    </div>
  );
};

export default About;