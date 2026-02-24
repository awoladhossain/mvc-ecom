import express from "express";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.route.js";
import couponRoutes from "./coupon.routes.js";
import paymentRoutes from "./payment.routes.js";
import productRoutes from "./products.routes.js";

const router = express.Router();


router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/coupon", couponRoutes);
router.use("/payment", paymentRoutes);

export default router;
