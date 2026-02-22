import express from "express";
import {
  addToCart,
  getCartItems,
  quantityUpdate,
  removeAllFromCart,
} from "../controllers/cart.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(getCartItems));
router.post("/", asyncHandler(addToCart));
router.delete("/", asyncHandler(removeAllFromCart));
router.put("/:id", asyncHandler(quantityUpdate));
export default router;
