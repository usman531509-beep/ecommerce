import React, { useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext.jsx";

const LoginPage = () => {
  const [state, setState] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { API_BASE_URL } = useContext(ShopContext);
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // LOGIN FUNCTION
  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log(data);
      
      
      
      if (res.ok) {
        // Save token + user data (includes role)
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user", JSON.stringify(data));

        alert("Login successful!");

        // Redirect based on role
        if (data.role === "admin") {
          window.location.replace("/admin");
        } else {
          window.location.replace("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
    setLoading(false);
  };

  // REGISTER FUNCTION
  const signup = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        alert("Signup successful!");
        window.location.replace("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-8 flex flex-col items-center border border-white/30"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 capitalize">
          {state === "login" ? "Welcome Back 👋" : "Create Account"}
        </h1>

        <div className="flex flex-col w-full gap-4">
          {state === "signup" && (
            <input
              type="text"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={changeHandler}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition-all duration-200 text-gray-700"
            />
          )}

          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition-all duration-200 text-gray-700"
          />

          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition-all duration-200 text-gray-700"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => (state === "login" ? login() : signup())}
          className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {loading
            ? state === "login"
              ? "Logging in..."
              : "Signing up..."
            : "Continue"}
        </motion.button>

        {state === "signup" ? (
          <p className="text-gray-700 text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-red-500 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-gray-700 text-sm mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("signup")}
              className="text-red-500 font-medium cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        )}

        <div className="flex items-center mt-5 gap-3 text-sm text-gray-600">
          <input type="checkbox" className="w-4 h-4 accent-red-500" />
          <p>By continuing, I agree to the terms & conditions</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
