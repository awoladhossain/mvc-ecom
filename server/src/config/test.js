import "dotenv/config";
import redis from "./redis.js";

const testRedis = async () => {
  await redis.set("foo", "bar");
  const value = await redis.get("foo");
  console.log("Redis value:", value);
};

testRedis();
