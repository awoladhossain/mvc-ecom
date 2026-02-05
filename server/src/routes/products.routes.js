import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
} from "../controllers/products.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, asyncHandler(getAllProducts));
router.get("/featured", asyncHandler(getFeaturedProducts));
router.get("/recommedations",asyncHandler(getRecommendedProducts))
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  asyncHandler(createProduct),
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  asyncHandler(deleteProduct),
);

export default router;
