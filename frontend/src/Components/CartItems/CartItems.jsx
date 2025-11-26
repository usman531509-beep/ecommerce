import React, { useContext, useState } from "react";
import { motion } from "framer-motion"; 
import { ShopContext } from "../../Context/ShopContext";

import remove_icon from "../Assests/cart_cross_icon.png";
import axios from "axios";
import { Link } from "react-router-dom";

const CartItems = () => { 
  const { cartItems, removeFromCart, getTotalCartAmount, clearCart } = useContext(ShopContext);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState({ address: "", city: "", postalCode: "", country: "" });
  const totalAmount = getTotalCartAmount();


  const handleChange = (e, type) => {
    if (type === "customer") setCustomer({ ...customer, [e.target.name]: e.target.value });
    else setShipping({ ...shipping, [e.target.name]: e.target.value });
  };


  const handleOrder = async () => {
    if (!customer.name || !customer.phone || cartItems.length === 0) {
      alert("Please fill required fields and add items to cart!");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      image: item.images?.[0]?.url || item.image,
      
      selectedColor: item.selectedColor || null,
      selectedSize: item.selectedSize || null,
    }));

    const totalPrice = orderItems.reduce((acc, i) => acc + i.price * i.qty, 0);

    const orderData = {
      customerInfo: customer,
      orderItems,
      shippingAddress: shipping,
      paymentMethod: "COD",
      totalPrice,
    };

    try {
      await axios.post("http://localhost:4000/api/orders", orderData);
      console.log("Order Placed:", orderData);
      
      alert("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 py-20 px-4 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-10"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", marginTop: "50px" }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🛒 Your Shopping Cart
        </h1>

        {/* Header Row */}
        {cartItems.length > 0 && (
          <div className="hidden md:grid grid-cols-6 text-center font-semibold text-gray-700 border-b pb-2">
            <p>Product</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
        )}

        {/* Cart Items */}
        <div className="mt-6 flex flex-col gap-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <motion.div
                key={item._id + item.selectedColor + item.selectedSize} // Key updated for uniqueness
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-6 items-center bg-white/70 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 gap-4"
              >
                <div className="flex justify-center">
                  <img
                    className="w-20 h-20 object-contain rounded-lg"
                    src={item.images?.[0]?.url || item.image || "/placeholder.jpg"}
                    alt={item.name}
                  />
                </div>

                {/* >>> UPDATED: Display Name, Color, and Size <<< */}
                <div className="text-gray-700 font-medium text-sm md:text-base text-center">
                    <p className="font-semibold">{item.name}</p>
                    {item.selectedColor && (
                        <p className="text-xs text-gray-500 mt-1">
                            Color: <span className="font-medium">{item.selectedColor}</span>
                        </p>
                    )}
                    {item.selectedSize && (
                        <p className="text-xs text-gray-500">
                            Size: <span className="font-medium">{item.selectedSize}</span>
                        </p>
                    )}
                </div>

                <p className="hidden md:block text-gray-600 text-center">
                  Rs {item.price}
                </p>

                <div className="flex justify-center">
                  <button className="bg-gray-100 border border-gray-300 px-4 py-1 rounded-full text-gray-700 font-semibold cursor-default">
                    {item.qty}
                  </button>
                </div>

                <p className="hidden md:block text-gray-800 font-semibold text-center">
                  Rs {item.price * item.qty}
                </p>

                <div className="flex justify-center">
                  <motion.img
                    src={remove_icon}
                    alt="Remove"
                    className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromCart(item._id)}
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-10 text-gray-600"
            >
              <p className="text-xl">Your cart is empty 😔</p>
              <Link
                to="/"
                className="text-red-500 hover:underline font-medium mt-2 inline-block"
              >
                Continue Shopping
              </Link>
            </motion.div>
          )}
        </div>

        {/* Totals */}
        {cartItems.length > 0 && (
          <div className="mt-10 bg-white/70 rounded-2xl shadow-inner p-6 md:p-8 flex flex-col gap-6">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between text-gray-700">
                <p>Subtotal</p>
                <p>Rs {totalAmount}</p>
              </div>
              <div className="flex justify-between text-gray-700">
                <p>Shipping Fee</p>
                <p className="text-green-500 font-medium">Free</p>
              </div>
              <div className="flex justify-between text-gray-800 font-semibold text-lg pt-2 border-t">
                <p>Total</p>
                <p>Rs {totalAmount}</p>
              </div>
            </div>

            {/* User Info Form */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                🧍‍♂️ Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  onChange={(e) => handleChange(e, "customer")}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  onChange={(e) => handleChange(e, "customer")}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone *"
                  onChange={(e) => handleChange(e, "customer")}
                  className="border p-2 rounded"
                  required
                />
              </div>

              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                🚚 Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="address"
                  placeholder="Address *"
                  onChange={(e) => handleChange(e, "shipping")}
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="city"
                  placeholder="City *"
                  onChange={(e) => handleChange(e, "shipping")}
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={(e) => handleChange(e, "shipping")}
                  className="border p-2 rounded"
                />
                <input
                  name="country"
                  placeholder="Country *"
                  onChange={(e) => handleChange(e, "shipping")}
                  className="border p-2 rounded"
                  required
                />
              </div>
            </div>

            {/* Place Order Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 text-center"
            >
              <button
                onClick={handleOrder}
                className="w-full md:w-[250px] py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Place Order
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartItems;