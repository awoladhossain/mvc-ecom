import express from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/auth.controller.js";
import {
  authMiddleware,
  refreshTokenMiddleware,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, signupSchema } from "../validators/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), asyncHandler(signup));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", authMiddleware, asyncHandler(logout));
router.post("/refresh", refreshTokenMiddleware, asyncHandler(refreshToken));

export default router;
