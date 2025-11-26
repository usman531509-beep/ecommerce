import express from "express";
import { addToCart } from "../Controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);

export default router;
