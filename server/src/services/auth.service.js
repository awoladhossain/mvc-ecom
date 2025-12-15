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
