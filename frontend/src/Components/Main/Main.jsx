import React from "react";
import { motion } from "framer-motion";
import main_img from "../Assests/main_img.png";
import hand_icon from "../Assests/hand_icon.png";
import main_img1 from "../Assests/main_img1.png";
import { Link } from "react-router-dom";

const Main = () => {
  const handleScrollToNewCollection = () => {
    const section = document.getElementById("new-collection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>

      <section className="relative flex flex-col md:flex-row items-center justify-center min-h-[85vh] bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] overflow-hidden font-[Lucida_Sans] px-6 md:px-16 lg:px-24 gap-6 md:gap-10 pt-[ 0px] md:pt-[100px]">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-10 left-16 w-24 h-24 bg-pink-200 rounded-full blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-28 h-28 bg-green-200 rounded-full blur-2xl"
        />


        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 flex flex-col justify-center gap-5 md:gap-6 text-center md:text-left z-10 max-w-[520px]"
        >
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center md:justify-start gap-3 md:gap-5"
            >
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-black text-4xl sm:text-5xl md:text-[5rem] font-semibold leading-tight"
              >
                New
              </motion.p>

              <motion.img
                src={hand_icon}
                alt="hand icon"
                className="w-10 sm:w-12 md:w-[100px]"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-black text-4xl sm:text-5xl md:text-[5rem] font-medium leading-tight"
            >
              Collection
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[#ff4141] text-4xl sm:text-5xl md:text-[5rem] font-semibold leading-tight"
            >
              For Everyone
            </motion.p>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-black text-4xl sm:text-5xl md:text-[5rem] font-semibold leading-tight"
            >
              To Anywhere
            </motion.p>
          </div>



          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center md:justify-start mt-6"
          >

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToNewCollection}
              className="w-[200px] sm:w-[230px] h-[60px] sm:h-[65px] rounded-full bg-[#ff4141] text-white text-[18px] sm:text-[20px] font-semibold cursor-pointer shadow-md hover:shadow-lg hover:bg-[#e63b3b] transition-all duration-300"
            >
              Latest Collection
            </motion.button>

          </motion.div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", easeIn: 0.2 }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center z-10 max-w-[550px]"
        >
          <motion.img
            src={main_img1}
            alt="main"
            className="w-[80%] sm:w-[70%] md:w-[75%] max-w-[450px] object-contain drop-shadow-md"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.05 }}
          />
        </motion.div>
      </section>
    </>
  );
};

export default Main;
