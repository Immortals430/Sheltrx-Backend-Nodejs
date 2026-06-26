import { app } from "./index.js";
import { connectRedis } from "@/lib/redis.js";
const PORT = Number(process.env.PORT) || 8000;

const server = async () => {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Connceted to Express Server`);
  });
};

export default server;
