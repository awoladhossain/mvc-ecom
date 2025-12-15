import redis from "../config/redis.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

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
    "+password"
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
  await redis.del(`refresh_token:${userId}`);
  return true;
};
