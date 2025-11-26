import axios from "axios";

const API_URL = "http://localhost:4000/api/auth/";

// Register
const register = async (userData) => {
  const res = await axios.post(API_URL + "register", userData);
  if (res.data.token) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

// Login
const login = async (userData) => {
  const res = await axios.post(API_URL + "login", userData);
  if (res.data.token) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

// Logout
const logout = () => localStorage.removeItem("user");

const authService = { register, login, logout };
export default authService;
