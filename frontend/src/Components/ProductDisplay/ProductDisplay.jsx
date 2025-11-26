import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext";
import star_icon from "../Assests/star_icon.png";


const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  const [showPopup, setShowPopup] = useState(false);

  const colors = product.colors || [];
  const sizes = product.sizes || [];

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

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/reviews/product/${product._id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Review fetch error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product._id]);

  const submitReview = async () => {
    if (!name || !email || !rating || !comment)
      return alert("Please fill all fields");

    try {
      await axios.post("http://localhost:4000/api/reviews", {
        productId: product._id,
        name,
        email,
        rating,
        comment,
      });

      alert("Review submitted successfully!");

      setName("");
      setEmail("");
      setRating(5);
      setComment("");

      fetchReviews();
    } catch (error) {
      console.error("Review Submit Error:", error.message);
      alert("Failed to submit review");
    }
  };

  const handleAddToCart = () => {
    if (colors.length > 0 && !selectedColor)
      return alert("Please select a color");
    if (sizes.length > 0 && !selectedSize)
      return alert("Please select a size");

    addToCart({
      ...product,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null,
      price: product.price,
    });

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const isAddToCartDisabled =
    (colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize);

  return (
    <div className="relative w-full px-5 sm:px-10 py-10 bg-white animate-fadeIn">
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl z-50">
          <p className="font-semibold">Product added to cart!</p>
          <a href="/cart" className="underline text-sm mt-1 inline-block">
            Go to Cart →
          </a>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: IMAGES */}
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full max-w-lg h-[450px] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <button
              onClick={() => {
                const index = allImages.indexOf(mainImage);
                const newIndex = (index - 1 + allImages.length) % allImages.length;
                setMainImage(allImages[newIndex]);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white w-10 h-10 rounded-full hover:bg-opacity-70"
            >
              ‹
            </button>

            <img src={mainImage} className="w-full h-full object-contain" />

            <button
              onClick={() => {
                const index = allImages.indexOf(mainImage);
                const newIndex = (index + 1) % allImages.length;
                setMainImage(allImages[newIndex]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white w-10 h-10 rounded-full hover:bg-opacity-70"
            >
              ›
            </button>
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition transform hover:scale-105 ${
                  mainImage === img ? "border-red-500 shadow-md" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex flex-col gap-5 text-gray-700 animate-slideUp">
          <h1 className="text-3xl font-semibold tracking-wide">{product.name}</h1>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={star_icon} className="w-5" />
            ))}
            <p className="text-sm text-gray-500 ml-2">({reviews.length} reviews)</p>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-4">
            {product.old_price && (
              <span className="line-through text-gray-400">Rs {product.old_price}</span>
            )}
            <span className="text-red-600 text-2xl font-bold">Rs {product.price}</span>
          </div>

          {/* COLORS */}
          {colors.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Select Color:</p>
              <div className="flex gap-3 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-full border transition shadow-sm ${
                      selectedColor === c
                        ? "bg-red-500 text-white border-red-500 shadow-md"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZES */}
          {sizes.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Select Size:</p>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-full border transition shadow-sm ${
                      selectedSize === s
                        ? "bg-red-500 text-white border-red-500 shadow-md"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ADD TO CART */}
          <button
            disabled={isAddToCartDisabled}
            onClick={handleAddToCart}
            className={`mt-5 w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-lg transition duration-300 shadow-md ${
              isAddToCartDisabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            Add to Cart
          </button>

          {/* REVIEW FORM */}
          <div className="mt-10 p-5 border rounded-xl bg-gray-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Write a Review</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r} Star</option>
              ))}
            </select>

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 rounded w-full h-24 mb-3"
            />

            <button
              onClick={submitReview}
              className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition"
            >
              Submit Review
            </button>
          </div>

          {/* REVIEWS */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Customer Reviews</h2>

            {reviews.length === 0 ? (
              <p>No reviews yet</p>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="p-3 border-b">
                  <p className="font-semibold text-red-600">{r.name}</p>
                  <p className="font-semibold">⭐ {r.rating} / 5</p>
                  <p className="text-gray-700">{r.comment}</p>
                  <p className="text-gray-400 text-sm">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
