import express from "express";
import { createCheckoutSessionController } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSessionController,
);
export default router;
