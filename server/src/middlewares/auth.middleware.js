import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new ApiError(401, "No access token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Invalid access token");
  }
};

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user?.role === "ADMIN") {
    return next();
  }
  throw new ApiError(403, "Admin access required");
});

export const refreshTokenMiddleware = (req, res, next) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    throw new ApiError(401, "No refresh token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Invalid refresh token");
  }
};
