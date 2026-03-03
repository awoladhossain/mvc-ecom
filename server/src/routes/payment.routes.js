import express from "express";
import {
  checkoutSuccessController,
  createCheckoutSessionController,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSessionController,
);

router.post("/checkout-success", authMiddleware, checkoutSuccessController);
export default router;
