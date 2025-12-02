
// import react, {createContext, useEffect, useState} from 'react';
// //import all_product from '../Components/Assests/all_product'
// import axios from 'axios';
// export const ShopContext = createContext(null);

// const getDefaultCart = ()=>{
//     let cart = {};
//     for (let index = 0; index < 100; index++) {
//         cart[index] = 0;
//     }
//     return cart;
// }


// const ShopContextProvider = (props)=>{
//     const [cartItems, setCartItems] = useState(getDefaultCart());
//     const [all_product, setall_product] = useState([]);

//     useEffect(()=>{
//         axios.get('http://localhost:4000/allproducts').then((res)=>{
//             setall_product(res.data);
            
//         })
//     },[])
    
//     const addToCart = (itemId)=>{
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
//        console.log(cartItems)
//     }
//     const removeFromCart = (itemId)=>{
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
//     }

    
//     const getTotalCartAmount = ()=>{
//         let totalAmont = 0;
//         for(const item in cartItems)
//         {
//             if (cartItems[item]>0)
//             {
//                 let itemInfo = all_product.find((product)=>product.id === Number(item));
//                 totalAmont += itemInfo.new_price * cartItems[item];
//             }
            
//         }
//         return totalAmont;
//     }

//     const getTotalCartItem=()=>{
//         let totalItem = 0
//         for(const item in cartItems)
//         {
//             if(cartItems[item]>0)
//             {
//                 totalItem += cartItems[item];
//             }
//         }
//         return totalItem;
//     }

//     const ContextValue = {all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItem};
//     return(
//         <ShopContext.Provider value= {ContextValue}>
//             {props.children} 
//         </ShopContext.Provider>
//     )
// }

// export default ShopContextProvider;
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]); // changed from object → array
  console.log("Cart Items:", cartItems);
  const [all_product, setAllProduct] = useState([]);
  const [user, setUser] = useState(localStorage.getItem("auth-token") || null);
  const [loadingUser, setLoadingUser] = useState(false);
  const API_BASE_URL = "https://ecommerce-w9sv.onrender.com";
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
      prev.filter((item) => item._id !== productId)
    );
  };

  //Clear cart
  const clearCart = () => setCartItems([]);

  //Total cart price
  const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  //Total item count
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
    cartItems,
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


