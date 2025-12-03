import express from "express";
import { v2 as cloudinary } from "cloudinary"; // Cloudinary library
import { CloudinaryStorage } from "multer-storage-cloudinary"; // Cloudinary storage engine
import multer from "multer";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/productController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

// --- 🛑 START: CLOUDINARY CONFIGURATION FOR PERMANENT STORAGE 🛑 ---

// 1. Cloudinary Credentials Configure karein (Yeh .env se automatically load honge)
// Ensure ki aapne index.js mein dotenv.config() kiya hua hai.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cloudinary Storage Engine ko setup karein
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_atelier_products", // Cloudinary par folder ka naam
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // Optional: Image ko optimize karne ke liye transformation rules
    // transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({
  storage: storage,
  // FileFilter ki ab zaroorat nahi kyunki allowed_formats params mein set hai,
  // lekin agar aap custom size limit lagana chahte hain toh yahan laga sakte hain.
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

// --- 🛑 END: CLOUDINARY CONFIGURATION 🛑 ---


// ------------------------------------
// Public Routes
// ------------------------------------
router.get("/", getProducts);
router.get("/:id", getProductById);


// ------------------------------------
// Admin Routes (Uploads ab Cloudinary par jayengi)
// ------------------------------------
// Note: 'upload.array("images", 5)' ab files ko Cloudinary par upload karega.
router.post("/", protect, admin, upload.array("images", 5), addProduct);
router.put("/:id", protect, admin, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;