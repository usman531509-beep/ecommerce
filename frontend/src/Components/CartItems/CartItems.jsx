import React, { useContext, useState } from "react";
import { motion } from "framer-motion"; 
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assests/cart_cross_icon.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { CheckCircle, Truck, ShoppingBag, Plus, Minus } from "lucide-react"; 

const CartItems = () => { 
  // 💡 all_product ko context se liya taake accurate calculation ho
  const { cartItems, removeFromCart, addToCart, clearCart, API_BASE_URL, all_product } = useContext(ShopContext);
  
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState({ address: "", city: "", postalCode: "", country: "" });
  const [orderPlaced, setOrderPlaced] = useState(false); 
  const [orderId, setOrderId] = useState(null); 

  
  const getProductPricing = (cartItem) => {
  
    const originalProd = all_product.find((p) => p._id === cartItem._id);
    const basePrice = originalProd ? parseFloat(originalProd.price) : parseFloat(cartItem.price);
    
    let discountedPrice = basePrice;
    let isApplied = false;

    // 2. Sirf percentage ke mutabiq calculation karein
    if (cartItem.currentOffer && cartItem.currentOffer.isActive && cartItem.currentOffer.discountPercentage > 0) {
        const percentage = parseFloat(cartItem.currentOffer.discountPercentage);
        discountedPrice = basePrice - (basePrice * (percentage / 100));
        isApplied = true;
    }

    return {
      oldPrice: basePrice,
      newPrice: Number(discountedPrice.toFixed(2)),
      isDiscounted: isApplied
    };
  };

  // 💡 Manual Totals Calculation
  const totals = cartItems.reduce((acc, item) => {
    const pricing = getProductPricing(item);
    const qty = parseFloat(item.qty) || 0;
    acc.subtotal += pricing.oldPrice * qty;
    acc.totalPayable += pricing.newPrice * qty;
    return acc;
  }, { subtotal: 0, totalPayable: 0 });

  const totalDiscount = totals.subtotal - totals.totalPayable;

  const handleChange = (e, type) => {
    if (type === "customer") setCustomer({ ...customer, [e.target.name]: e.target.value });
    else setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!customer.name || !customer.phone || !shipping.address || !shipping.city || !shipping.country || cartItems.length === 0) {
      alert("Please fill all required fields!");
      return;
    }
    
    const orderItems = cartItems.map((item) => {
      const pricing = getProductPricing(item);
      return {
        product: item._id,
        name: item.name,
        qty: item.qty,
        price: pricing.newPrice, // Final calculated price bhej rahe hain
        image: item.images?.[0]?.url || item.image,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,
      };
    });

    const orderData = {
      customerInfo: customer,
      orderItems,
      shippingAddress: shipping,
      paymentMethod: "COD",
      totalPrice: totals.totalPayable,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
      setOrderId(response.data._id || response.data.id); 
      clearCart();
      setOrderPlaced(true);
      window.scrollTo(0, 0);
    } catch (error) {
      alert("Failed to place order.");
    }
  };

  const OrderConfirmation = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 px-6 bg-white rounded-xl shadow-2xl border-t-4 border-green-500">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h2 className="text-4xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h2>
      <p className="text-xl text-gray-600 mb-8">Your items are on their way to becoming your new favorites.</p>
      <div className="flex justify-center gap-12 text-gray-700">
        <div className="flex flex-col items-center text-center">
          <Truck className="w-8 h-8 text-red-500 mb-2" />
          <p className="font-semibold">Processing Delivery</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <ShoppingBag className="w-8 h-8 text-pink-500 mb-2" />
          <p className="font-semibold text-xs">Order ID: <span className="text-purple-600 break-all">{orderId}</span></p>
        </div>
      </div>
      <Link to="/" className="mt-10 inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold transition-all hover:scale-105">Continue Shopping</Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 py-20 px-4 md:px-10">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-10 mt-[50px]" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}>
        {orderPlaced ? <OrderConfirmation /> : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">🛒 Your Shopping Cart</h1>

            {cartItems.length > 0 && (
              <div className="hidden md:grid grid-cols-6 text-center font-semibold text-gray-700 border-b pb-2">
                <p>Product</p><p>Title</p><p>Price</p><p>Quantity</p><p>Total</p><p>Remove</p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                    const pricing = getProductPricing(item);
                    return (
                      <motion.div key={item._id + (item.selectedSize || '')} layout className="grid grid-cols-2 md:grid-cols-6 items-center bg-white/70 rounded-xl shadow-sm p-4 gap-4">
                        <div className="flex justify-center">
                          <img className="w-20 h-20 object-contain rounded-lg" src={item.images?.[0]?.url || item.image} alt="" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-[12px] text-gray-400">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        </div>
                        <div className="text-center"> 
                            <p className={`font-bold ${pricing.isDiscounted ? 'text-red-600' : 'text-gray-800'}`}>Rs {pricing.newPrice.toFixed(2)}</p>
                            {pricing.isDiscounted && <p className="text-[12px] text-gray-400 line-through">Rs {pricing.oldPrice.toFixed(2)}</p>}
                        </div>

                        {/* ➕ Qty Controls ➖ */}
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => removeFromCart(item._id)} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"><Minus size={14} /></button>
                          <span className="font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => addToCart(item)} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"><Plus size={14} /></button>
                        </div>

                        <p className="hidden md:block text-gray-800 font-bold text-center">Rs {(pricing.newPrice * item.qty).toFixed(2)}</p>
                        <div className="flex justify-center">
                          <motion.img src={remove_icon} className="w-6 h-6 cursor-pointer" whileTap={{ scale: 0.8 }} onClick={() => removeFromCart(item._id)} />
                        </div>
                      </motion.div>
                    );
                })
              ) : (
                <div className="text-center py-10"><p className="text-xl text-gray-500 font-medium">Your cart is empty 😔</p><Link to="/" className="text-red-500 font-bold underline">Continue Shopping</Link></div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="mt-10 bg-white/70 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                <div className="w-full md:w-1/2 space-y-3">
                  <div className="flex justify-between text-gray-700"><span>Subtotal (Original)</span><span className={totalDiscount > 0 ? 'line-through text-gray-500' : 'font-medium'}>Rs {totals.subtotal.toFixed(2)}</span></div>
                  {totalDiscount > 0.01 && <div className="flex justify-between text-green-600 font-bold"><span>Discount Applied 🎉</span><span>- Rs {totalDiscount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-gray-800 font-bold text-xl pt-2 border-t"><span>Total Payable</span><span>Rs {totals.totalPayable.toFixed(2)}</span></div>
                </div>

                {/* Form fields: SAME AS ORIGINAL */}
                <div className="bg-white p-6 rounded-xl shadow-md mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">🧍‍♂️ Customer Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" name="name" placeholder="Full Name *" onChange={(e) => handleChange(e, "customer")} className="border p-2 rounded outline-none focus:border-red-400" required value={customer.name} />
                    <input type="email" name="email" placeholder="Email (optional)" onChange={(e) => handleChange(e, "customer")} className="border p-2 rounded outline-none focus:border-red-400" value={customer.email} />
                    <input type="text" name="phone" placeholder="Phone *" onChange={(e) => handleChange(e, "customer")} className="border p-2 rounded outline-none focus:border-red-400" required value={customer.phone} />
                  </div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">🚚 Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="address" placeholder="Address *" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded outline-none focus:border-red-400" required value={shipping.address} />
                    <input name="city" placeholder="City *" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded outline-none focus:border-red-400" required value={shipping.city} />
                    <input name="postalCode" placeholder="Postal Code" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded outline-none focus:border-red-400" value={shipping.postalCode} />
                    <input name="country" placeholder="Country *" onChange={(e) => handleChange(e, "shipping")} className="border p-2 rounded outline-none focus:border-red-400" required value={shipping.country} />
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6 text-center">
                  <button onClick={handleOrder} className="w-full md:w-[280px] py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold shadow-lg">Confirm Order (COD)</button>
                </motion.div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CartItems;