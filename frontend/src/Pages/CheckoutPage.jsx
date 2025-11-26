import React, { useState } from "react";
import { motion } from "framer-motion";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully! (Cash on Delivery selected)");
    console.log("Checkout data:", formData);
    // Here you could send formData to your backend (POST /checkout)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 flex justify-center items-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-2xl p-8 md:p-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          🧾 Checkout
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please fill in your delivery details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={changeHandler}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/80"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/80"
              placeholder="example@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={changeHandler}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/80"
              placeholder="03XXXXXXXXX"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Delivery Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={changeHandler}
              required
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/80 resize-none"
              placeholder="House no, Street, Area"
            ></textarea>
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={changeHandler}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/80"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={changeHandler}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/80"
                placeholder="e.g. 54000"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Payment Method
            </label>
            <div className="flex items-center gap-3 bg-white/80 px-4 py-3 rounded-xl border border-gray-300">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={changeHandler}
                className="w-5 h-5 text-pink-500 accent-pink-500"
              />
              <label className="text-gray-700 font-medium">
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            Place Order
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
