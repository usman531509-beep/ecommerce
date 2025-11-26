import User from "../models/User.js";
import Cart from "../models/Cart.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    // create empty cart for new user
    await Cart.create({ user: user._id, items: [] });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      cart: [], // new user has empty cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  LOGIN USER — returns user info + saved cart
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      //  Fetch the user's cart
      const cart = await Cart.findOne({ user: user._id }).populate(
        "items.product",
        "name price image"
      );

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        cart: cart ? cart.items : [], // include cart items
      });
      
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// New: Get logged-in user profile
export const getUserProfile = async (req, res) => {
    
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // don’t return passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};