import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaGlobeAmericas, FaSmile } from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers className="text-5xl text-red-500" />,
    label: "Happy Customers",
    value: 10000,
    suffix: "+",
    delay: 0.2,
  },
  {
    icon: <FaBoxOpen className="text-5xl text-yellow-500" />,
    label: "Orders Delivered",
    value: 50000,
    suffix: "+",
    delay: 0.4,
  },
  {
    icon: <FaGlobeAmericas className="text-5xl text-blue-500" />,
    label: "Countries Served",
    value: 5,
    suffix: "+",
    delay: 0.6,
  },
  {
    icon: <FaSmile className="text-5xl text-green-500" />,
    label: "Customer Satisfaction",
    value: 99,
    suffix: "%",
    delay: 0.8,
  },
];

export default function StatsSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-red-50 via-white to-red-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
        >
          🌟 Our Growing Family
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: item.delay, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                <CountUp
                  start={0}
                  end={item.value}
                  duration={2.5}
                  separator=","
                  suffix={item.suffix}
                />
              </h3>
              <p className="text-gray-600 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
