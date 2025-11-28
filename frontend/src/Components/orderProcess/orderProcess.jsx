import React from "react";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaHome,
  FaMoneyBillWave,
  FaArrowRight,
  FaArrowDown,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaShoppingCart className="text-4xl text-red-500" />,
    title: "Step 1: Place Your Order",
    description:
      "Choose your favorite products and complete checkout easily from our secure store.",
  },
  {
    icon: <FaBoxOpen className="text-4xl text-yellow-500" />,
    title: "Step 2: We Pack Your Parcel",
    description:
      "Our team carefully packs your items with love and care to ensure safe delivery.",
  },
  {
    icon: <FaTruck className="text-4xl text-blue-500" />,
    title: "Step 3: Handed to Courier",
    description:
      "Your parcel is dispatched to our trusted courier partner for fast delivery.",
  },
  {
    icon: <FaHome className="text-4xl text-green-500" />,
    title: "Step 4: Parcel Arrives at Your Doorstep",
    description: "Track your order and receive it conveniently at your home.",
  },
  {
    icon: <FaMoneyBillWave className="text-4xl text-emerald-500" />,
    title: "Step 5: Pay on Delivery",
    description:
      "Once you receive your parcel, pay the amountneasy and hassle-free!",
  },
];

export default function OrderProcess() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-red-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-10"
        >
          🛍️ How Your Order is Processed
        </motion.h2>

        {/* Desktop View (Horizontal Flow) */}
        <div className="hidden md:flex justify-center items-center gap-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 w-56 hover:shadow-2xl transition-transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow between cards */}
              {index < steps.length - 1 && (
                <FaArrowRight className="text-red-400 text-3xl animate-pulse" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile View (Vertical Flow) */}
        <div className="flex flex-col items-center gap-8 md:hidden">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm hover:shadow-2xl transition-transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Down Arrow */}
              {index < steps.length - 1 && (
                <FaArrowDown className="text-red-400 text-3xl animate-bounce" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
