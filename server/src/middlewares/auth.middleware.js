import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
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
