import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signupSchema } from "../validators/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), asyncHandler(signup));

export default router;
