import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Sara Ali",
    city: "Lahore",
    review:
      "Amazing quality! My order arrived earlier than expected. The packaging was beautiful and safe.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Ahmed Khan",
    city: "Karachi",
    review:
      "Top-notch service and excellent customer support. Definitely shopping again!",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Fatima Noor",
    city: "Islamabad",
    review:
      "Loved the product! Exactly as shown in the pictures. Highly recommended for everyone.",
    rating: 4,
    img: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    name: "Bilal Ahmed",
    city: "Multan",
    review:
      "Smooth checkout process and fast delivery. The quality is even better than I expected!",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-red-50 via-white to-red-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-10"
        >
          What Our Customers Says about Us
        </motion.h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mb-4 shadow-md border-2 border-red-400"
                />
                <h3 className="text-lg font-semibold text-gray-800">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{t.city}</p>
                <div className="flex justify-center mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mx-0.5" />
                  ))}
                </div>
                <p className="text-gray-600 italic text-sm leading-relaxed">
                  “{t.review}”
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
