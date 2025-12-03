import React, { useContext, useState } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const Checkout = () => {
  const { cartItems, clearCart, API_BASE_URL } = useContext(ShopContext);

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState({ address: "", city: "", postalCode: "", country: "" });

  const handleChange = (e, type) => {
    if (type === "customer")
      setCustomer({ ...customer, [e.target.name]: e.target.value });
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
      await axios.post(`${API_BASE_URL}/api/orders`, orderData);
      console.log(orderData);
      
      alert("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Checkout (No Login)
      </h1>

      {/* Customer Info */}
      <div className="grid grid-cols-1 gap-3 mb-6 bg-white p-5 rounded-lg shadow">
        <h2 className="font-semibold text-lg">Customer Info</h2>
        <input name="name" placeholder="Full Name" onChange={(e) => handleChange(e, "customer")} className="border p-2 rounded" required />
        <input name="email" placeholder="Email (optional)" onChange={(e) => handleChange(e, "customer")} className="border p-2 rounded" />
        <input name="phone" placeholder="Phone" onChange={(e) => handleChange(e, "customer")} className="border p-2 rounded" required />
      </div>

      {/* Shipping Info */}
      <div className="grid grid-cols-1 gap-3 mb-6 bg-white p-5 rounded-lg shadow">
        <h2 className="font-semibold text-lg">Shipping Address</h2>
        <input name="address" placeholder="Address" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded" required />
        <input name="city" placeholder="City" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded" required />
        <input name="postalCode" placeholder="Postal Code" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded" />
        <input name="country" placeholder="Country" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded" required />
      </div>

      <button
        onClick={handleOrder}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
