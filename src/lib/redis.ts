import { createClient } from "redis";

 const redisClient = createClient(
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

 const pubClient = redisClient.duplicate();
 const subClient = redisClient.duplicate();

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

subClient.on("error", (err) => {
  console.error("Redis Sub Error:", err);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await Promise.all([
      redisClient.connect(),
      pubClient.connect(),
      subClient.connect(),
    ]);
    console.log("Connected to Redis Server");
  }
};

export {
  redisClient,
  pubClient,
  subClient
}
