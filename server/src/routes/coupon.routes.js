import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCoupon);
router.post("/validate", authMiddleware, validateCoupon);
export default router;
