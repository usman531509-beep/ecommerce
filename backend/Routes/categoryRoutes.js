import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../Controllers/categoryController.js";

import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

//Public route - anyone can see categories
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

//Protected admin routes - only admins can modify categories
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;
