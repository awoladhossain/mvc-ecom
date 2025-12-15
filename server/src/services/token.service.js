import redis from "../config/redis.js";

export const saveRefreshToken = async (userId, refreshToken) => {
  // const data = {
  //   token: refreshToken,
  //   createdAt: Date.now(),
  // };
  await redis.set(`refresh_token:${userId}`, refreshToken, {
    ex: 7 * 24 * 60 * 60,
  }); // Expires in 7 days;
};
