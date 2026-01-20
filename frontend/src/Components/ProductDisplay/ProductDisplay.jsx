import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext";
import star_icon from "../Assests/star_icon.png";
import { Link } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck, CreditCard, Clock } from "lucide-react";
import parse from "html-react-parser";

const ProductDisplay = ({ product }) => {
  const { addToCart, API_BASE_URL, all_product } = useContext(ShopContext);
  const [showPopup, setShowPopup] = useState(false);

  const hasOffer = product.currentOffer && product.currentOffer.isActive && product.currentOffer.discountPercentage > 0;
  const currentNewPrice = hasOffer 
    ? product.price - (product.price * product.currentOffer.discountPercentage / 100)
    : product.price;

  const displayOldPrice = hasOffer ? product.price : null;
  const discountLabel = hasOffer ? `${product.currentOffer.discountPercentage}% OFF` : null;

  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const RelatedProducts = all_product.filter(
    (item) =>
      item._id !== product._id &&
      product.category?.name && 
      item.category?.name &&
      item.category.name === product.category.name
  ).slice(0, 4);

  const allImages =
    product.images?.length > 0
      ? product.images.map((img) => img.url)
      : [product.image || "https://placehold.co/400x400/CCCCCC/000?text=Product+Image"];

  const [mainImage, setMainImage] = useState(allImages[0]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Urgency Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reviews/product/${product._id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Review fetch error:", err);
    }
  };
  const submitReview = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/reviews`, {
        productId: product._id,
        name,
        email,
        rating,
        comment
      });
      // Reset form fields
      setName("");
      setEmail("");
      setRating(5);
      setComment("");
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  useEffect(() => {
    setMainImage(allImages[0]); 
    setSelectedColor("");
    setSelectedSize("");
    fetchReviews();
  }, [product._id]); 

  const handleAddToCart = () => {
    if (colors.length > 0 && !selectedColor) return alert("Please select a color");
    if (sizes.length > 0 && !selectedSize) return alert("Please select a size");

    addToCart({
      ...product,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null,
      price: currentNewPrice,
    });

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const isAddToCartDisabled = (colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize);

  return (
    <div className="relative w-full px-5 sm:px-10 py-10 bg-white animate-fadeIn">
      {showPopup && (
        <div className="fixed top-12 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl z-50 animate-slideInRight">
          <p className="font-semibold">Successfully added to cart!</p>
          <Link to="/cart" className="underline mt-1 text-sm block">View Shopping Cart</Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full max-w-lg h-[450px] bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-100">
            {discountLabel && (
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white font-bold px-4 py-1.5 rounded-full shadow-md animate-pulse">
                {discountLabel}
              </div>
            )}
            <button
              onClick={() => {
                const index = allImages.indexOf(mainImage);
                const newIndex = (index - 1 + allImages.length) % allImages.length;
                setMainImage(allImages[newIndex]);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white w-10 h-10 rounded-full hover:bg-opacity-70 z-10 transition-all"
            >‹</button>
            <img src={mainImage} className="w-full h-full object-contain" alt={product.name} />
            <button
              onClick={() => {
                const index = allImages.indexOf(mainImage);
                const newIndex = (index + 1) % allImages.length;
                setMainImage(allImages[newIndex]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white w-10 h-10 rounded-full hover:bg-opacity-70 z-10 transition-all"
            >›</button>
          </div>
          <div className="flex items-center gap-4 mt-4 overflow-x-auto no-scrollbar py-2 w-full max-w-lg">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg cursor-pointer border-2 transition transform hover:scale-105 ${
                  mainImage === img ? "border-red-500 shadow-md" : "border-gray-300"
                }`}
                alt=""
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 text-gray-700 animate-slideUp">
          <p className="text-red-600 font-bold text-sm tracking-widest uppercase">Premium Collection</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={star_icon} className="w-4" alt="" />
            ))}
            <p className="text-sm text-gray-500 ml-2">({reviews.length} Customer Reviews)</p>
          </div>

          <div className="flex items-center gap-4 py-2 border-y border-gray-100">
            {displayOldPrice && (
              <span className="line-through text-gray-400 text-lg">Rs {displayOldPrice}</span>
            )}
            <span className="text-red-600 text-3xl font-black">Rs {currentNewPrice}</span>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-green-700 text-xs font-bold uppercase">In Stock</span>
            </div>
          </div>

          {/* ⚡ URGENCY TIMER SECTION */}
          {hasOffer && (
            <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
              <Clock size={18} className="text-red-600" />
              <p className="text-sm font-semibold text-red-700">Flash Sale ends in:</p>
              <div className="flex gap-2 text-red-700 font-bold">
                <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          )}

          {/* 🚚 DELIVERY & SERVICE BADGES */}
          <div className="grid grid-cols-2 gap-4 my-2">
             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Truck size={20} className="text-gray-800" />
                <div>
                   <p className="text-[11px] font-bold uppercase text-gray-900 leading-tight">Fast Delivery</p>
                   <p className="text-[10px] text-gray-500">4-6 Days Arrival</p>
                </div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <RotateCcw size={20} className="text-gray-800" />
                <div>
                   <p className="text-[11px] font-bold uppercase text-gray-900 leading-tight">Easy Returns</p>
                   <p className="text-[10px] text-gray-500">7 Days Guarantee</p>
                </div>
             </div>
          </div>

          {colors.length > 0 && (
            <div>
              <p className="font-bold text-sm mb-2 uppercase">Select Color:</p>
              <div className="flex gap-3 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-5 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedColor === c ? "bg-red-600 text-white border-red-600 shadow-lg" : "bg-white border-gray-200 hover:border-gray-400"
                    }`}
                  > {c} </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <p className="font-bold text-sm mb-2 uppercase">Select Size:</p>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all ${
                      selectedSize === s ? "bg-red-600 text-white border-red-600 shadow-lg" : "bg-white border-gray-200 hover:border-gray-400"
                    }`}
                  > {s} </button>
                ))}
              </div>
            </div>  
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              disabled={isAddToCartDisabled}
              onClick={handleAddToCart}
              className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md transform active:scale-95 ${
                isAddToCartDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 shadow-red-200 hover:shadow-xl"
              }`}
            > Add to Cart </button>
          </div>

          {/* 🛡️ TRUST INFO */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2 opacity-70">
                <ShieldCheck size={16} />
                <span className="text-[11px] font-bold uppercase">100% Original</span>
             </div>
             <div className="flex items-center gap-2 opacity-70">
                <CreditCard size={16} />
                <span className="text-[11px] font-bold uppercase">Cash on Delivery Easy Payment</span>
             </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto mt-14 px-4 sm:px-8">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
            Product Details
          </h2>
          <div className="text-gray-600 text-base leading-relaxed whitespace-pre-line break-words overflow-hidden w-full">
          {parse(product.description)}
          </div>
        </div>
      </div>

      {/* Reviews Form & List (Keeping your original logic, just slight UI polish) */}
      <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 sm:px-8">
          <div className="p-8 border border-gray-100 rounded-2xl bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 outline-none transition-all">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars Rating</option>)}
              </select>
              <textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 rounded-xl h-32 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              <button onClick={submitReview} className="bg-black text-white px-10 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"> Submit Review </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">What Customers Say ({reviews.length})</h2>
            <div className="max-h-[500px] overflow-y-auto pr-4 no-scrollbar space-y-4">
              {reviews.length === 0 ? <p className="text-gray-400 italic">No reviews yet. Be the first to share!</p> : reviews.map((r, i) => (
                <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-red-600">{r.name}</p>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⭐ {r.rating}/5</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-snug">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Related products */}
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">You May Also Like</h2>
          <div className="h-0.5 flex-1 bg-gray-100 mx-6 hidden sm:block"></div>
          <Link to="/products" className="text-red-600 font-bold text-sm hover:underline">See All Products</Link>
        </div>
        
        {RelatedProducts.length === 0 ? (
          <p className="text-gray-500 italic">Finding similar products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {RelatedProducts.map((item) => {
              const itemHasOffer = item.currentOffer && item.currentOffer.isActive;
              const itemNewPrice = itemHasOffer 
                ? item.price - (item.price * item.currentOffer.discountPercentage / 100)
                : item.price;

              return (
                <Link to={`/product/${item._id}`} key={item._id} onClick={() => window.scrollTo(0,0)} className="group bg-white rounded-2xl p-3 sm:p-4 border border-gray-50 hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-square rounded-xl bg-gray-50 overflow-hidden mb-4">
                    <img
                      src={item.images?.[0]?.url || item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                    />
                    {itemHasOffer && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        -{item.currentOffer.discountPercentage}%
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 truncate text-sm sm:text-base">{item.name}</h3>
                  <p className="text-red-600 font-black text-sm sm:text-lg">Rs {itemNewPrice}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;