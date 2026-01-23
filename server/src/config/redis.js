import { Redis } from "@upstash/redis";
let redis = null;
export const getRedis = () => {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error("Missing Upstash Redis environment variables");
    }

    redis = new Redis({
      url,
      token,
    });
  }
  return redis;
};
