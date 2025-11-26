import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./Config/Db.js";
import { notFound, errorHandler } from "./Middleware/errorMiddleware.js";

// Import Routes
import authRoutes from "./Routes/Authroutes.js";
import productRoutes from "./Routes/productRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js"; // 🆕 Added
import reviewRoutes from "./Routes/ReviewRoutes.js"; // 🆕 Added

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//Serve uploaded images publicly
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//Default route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/reviews", reviewRoutes); 

//Error Handlers
app.use(notFound);
app.use(errorHandler);

//Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
