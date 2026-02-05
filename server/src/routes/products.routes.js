import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/products.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, asyncHandler(getAllProducts));
router.get("/featured", asyncHandler(getFeaturedProducts));
router.get("/recommendations", asyncHandler(getRecommendedProducts));

router.get("/category/:category", asyncHandler(getProductsByCategory));

router.patch("/:id",authMiddleware,adminMiddleware, asyncHandler(toggleFeaturedProduct))
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
