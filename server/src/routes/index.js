import express from "express";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.route.js";
import productRoutes from "./products.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);

export default router;
