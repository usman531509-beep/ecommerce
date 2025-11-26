import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Contact = () => {
    const socialclicks = (platform) => {
        let url = "";
        switch(platform) {
            case 'facebook':
                url = "https://www.facebook.com/yourprofile";
                break;
            case 'instagram':
                url = "https://www.instagram.com/yourprofile";
                break;
            case 'twitter':
                url = "https://www.twitter.com/yourprofile";
                break;
            default:
                return;
        }
        window.open(url, '_blank');
    };
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] py-20 px-6 md:px-16 lg:px-24 font-[Lucida_Sans]">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-[#ff4141] mb-4">
          Contact Us
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
          Have questions, feedback, or just want to say hello? We’d love to hear from you!  
          Fill out the form or reach us through the details below.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Send us a Message
          </h2>

          <form className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4141] transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4141] transition"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4141] transition"
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ff4141] text-white font-semibold py-3 rounded-full hover:bg-[#e63b3b] transition-all duration-300 shadow-md"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center gap-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800">Get in Touch</h2>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff4141] text-white p-3 rounded-full shadow-md">
              <Phone size={22} />
            </div>
            <p className="text-gray-700 text-lg">+92 303 7798802</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff4141] text-white p-3 rounded-full shadow-md">
              <Mail size={22} />
            </div>
            <p className="text-gray-700 text-lg">Usman531509@gmail.com</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#ff4141] text-white p-3 rounded-full shadow-md">
              <MapPin size={22} />
            </div>
            <p className="text-gray-700 text-lg">Lahore, Pakistan</p>
          </div>

            <div className="flex items-center gap-6 mt-4">
                <div
                    onClick={() => socialclicks('facebook')}
                    className="bg-[#3b5998] text-white p-3 rounded-full shadow-md cursor-pointer hover:bg-[#334d84] transition"
                >
                    <Facebook size={22} />
                </div>
                <div
                    onClick={() => socialclicks('instagram')}
                    className="bg-[#E1306C] text-white p-3 rounded-full shadow-md cursor-pointer hover:bg-[#c72e61] transition"
                >
                    <Instagram size={22} />
                </div>
                <div
                    onClick={() => socialclicks('twitter')}
                    className="bg-[#1DA1F2] text-white p-3 rounded-full shadow-md cursor-pointer hover:bg-[#1991da] transition"
                >
                    <Twitter size={22} />
                </div>
            </div> 
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
