import express from "express";
import { chatWithBot } from "../Controllers/chatController.js";


const router = express.Router();

router.post("/", chatWithBot);

export default router;
