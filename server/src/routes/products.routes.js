import express from "express";
import { getAllProducts } from "../controllers/products.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, asyncHandler(getAllProducts));

export default router;
