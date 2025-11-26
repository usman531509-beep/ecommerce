import express from "express";
import { registerUser, loginUser, getUserProfile, getAllUsers} from "../Controllers/authController.js";
import { admin, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile)
router.get("/allusers",protect, admin, getAllUsers)



export default router;
