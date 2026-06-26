import { createClient } from "redis";

export const redisClient = createClient(
  process.env.REDIS_URL
    ? {
        url: process.env.REDIS_URL,
      }
    : {
        socket: {
          host: "127.0.0.1",
          port: 6379,
        },
      },
);

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Connected to Redis Server");
  }
};

export default redisClient;
