import express from "express";
import {
  createReview,
  getReviewsByProduct,
  deleteReview,
getAllReviews,
} from "../Controllers/reviewsController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/",createReview);
router.get("/product/:productId", getReviewsByProduct);

// Protected Routes

router.get("/", protect, admin, getAllReviews);
router.delete("/:id", protect, admin, deleteReview);

export default router;