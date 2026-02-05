import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addToCart } from "../controllers/cart.controller.js";
const router = express.Router();

router.post("/", asyncHandler(addToCart));

export default router;

