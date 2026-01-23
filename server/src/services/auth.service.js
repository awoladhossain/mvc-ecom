import { getRedis } from "../config/redis.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "../utils/token.js";

export const signupService = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create(data);
  return user;
};

export const loginService = async (data) => {
  const existingUser = await User.findOne({ email: data.email }).select(
    "+password",
  );
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await existingUser.comparePassword(data.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  return existingUser;
};

export const logoutService = async (userId) => {
  const redis = getRedis();
  await redis.del(`refresh_token:${userId}`);
  return true;
};

export const refreshTokenService = async (userId, oldRefreshToken) => {
  // check redis
  const redis = getRedis();
  const storedToken = await redis.get(`refresh_token:${userId}`);
  if (!storedToken || storedToken !== oldRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }
  const user = await User.findById(userId).select("role");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // generate new tokens
  const { accessToken, refreshToken } = generateToken(userId, user.role);

  // store new refresh token in redis
  await redis.set(`refresh_token:${userId}`, refreshToken, {
    ex: 7 * 24 * 60 * 60, // 7 days
  });

  return { accessToken, refreshToken };
};
