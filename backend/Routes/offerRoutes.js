import express from "express";
import {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  getMarqueeOffers,
} from "../Controllers/offerController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllOffers);
router.get("/:id", getOfferById);

router.post("/", protect, admin, createOffer);
router.put("/:id", protect, admin, updateOffer);
router.delete("/:id", protect, admin, deleteOffer);
router.get("/marquee", getMarqueeOffers);


export default router;