import express from "express";
import { v2 as cloudinary } from "cloudinary"; 
import { CloudinaryStorage } from "multer-storage-cloudinary"; 
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_atelier_products", // Cloudinary par folder ka naam
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
   
  },
});

const upload = multer({
  storage: storage,
  
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});


router.get("/", getProducts);
router.get("/:id", getProductById);



router.post("/", protect, admin, upload.array("images", 5), addProduct);
router.put("/:id", protect, admin, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;