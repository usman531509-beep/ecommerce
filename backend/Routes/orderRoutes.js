import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from "../Controllers/orderController.js";
import { admin, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", createOrder);

// Admin routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

export default router;