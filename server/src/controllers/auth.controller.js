import {
  loginService,
  logoutService,
  refreshTokenService,
  signupService,
} from "../services/auth.service.js";
import { saveRefreshToken } from "../services/token.service.js";
import { setAuthCookies } from "../utils/cookie.js";
import { generateToken } from "../utils/token.js";

export const signup = async (req, res) => {
  const user = await signupService(req.body);
  const { accessToken, refreshToken } = generateToken(user._id, user.role);
  await saveRefreshToken(user._id, refreshToken);

  // use setAuthCookies to set cookies
  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({
    status: "success",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "User registered successfully",
  });
};

export const login = async (req, res) => {
  const user = await loginService(req.body);
  const { accessToken, refreshToken } = generateToken(user._id, user.role);
  await saveRefreshToken(user._id, refreshToken);

  // use setAuthCookies to set cookies
  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json({
    status: "success",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "User logged in successfully",
  });
};

export const logout = async (req, res) => {
  const userId = req.user.userId;
  await logoutService(userId);
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

export const refreshToken = async (req, res) => {
  const userId = req.user.userId;
  const oldRefreshToken = req.cookies.refresh_token;
  const { accessToken, refreshToken } = await refreshTokenService(
    userId,
    oldRefreshToken
  );

  // set new cookies
  setAuthCookies(res, accessToken, refreshToken);

  // send response
  res.status(200).json({
    status: "success",
    message: "Token refreshed successfully",
  });
};

