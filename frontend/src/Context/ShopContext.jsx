
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]); 
  console.log("Cart Items:", cartItems);
  const [all_product, setAllProduct] = useState([]);
  const [user, setUser] = useState(localStorage.getItem("auth-token") || null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  console.log("Offers in Context:", offers);
  
  const API_BASE_URL = "https://ecommerce-w9sv.onrender.com";
  // const API_BASE_URL = "http://localhost:4000";
  //Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        if (res.data) setAllProduct(res.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setAllProduct([]);
      }
    };
    fetchProducts();
  }, []);

  //Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories`);
        if (res.data) setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);
  
  // fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/offers`);
        if (res.data) setOffers(res.data);
      } catch (error) {
        console.error("Error fetching offers:", error.message);
        setOffers([]);
      }
    };
    fetchOffers();
  }, []);

  // Fetch user profile (if token exists)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      setLoadingUser(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        setUser(null);
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  //Add to cart (store full product + qty)
  const addToCart = (product) => {
  setCartItems((prev) => {
    const existing = prev.find(
      (item) =>
        item._id === product._id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize &&
        item.variationId === product.variationId
    );

    if (existing) {
      // Same product + same variation → increase qty
      return prev.map((item) =>
        item._id === product._id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize &&
        item.variationId === product.variationId
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      // New variation → add as new cart item
      return [...prev, { ...product, qty: 1 }];
    }
  });
};


  //Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  //Clear cart
  const clearCart = () => setCartItems([]);

  

const getDiscountedPrice = (item) => {
   
    if (item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price) {
        return item.discountPrice;
    }

    
    if (item.currentOffer && item.currentOffer.discountPercentage) {
        const originalPrice = parseFloat(item.price);
        const discount = parseFloat(item.currentOffer.discountPercentage);
        if (discount > 0) {
            return originalPrice * (1 - discount / 100);
        }
    }
    
    // Agar koi discount nahi hai, to original price return karein.
    return parseFloat(item.price);
};


const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => {
        const finalPrice = getDiscountedPrice(item);
        return total + finalPrice * item.qty;
    }, 0);
};


  const getTotalCartItem = () => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  };

  //Logout user
  const logoutUser = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const ContextValue = {
    all_product,
    categories,
    cartItems,
    offers,
    user,
    setUser,
    loadingUser,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getTotalCartItem,
    logoutUser,
    API_BASE_URL,
  };

  return (
    <ShopContext.Provider value={ContextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;


