import "dotenv/config";
import app from "./index.js";
import http from "http";
import { connectRedis } from "@/config/redis.js";
import { initializeSocket } from "./socket.js";
const PORT = Number(process.env.PORT) || 8000;

const server = http.createServer(app);

const kaaBoom = async () => {
  await connectRedis();
  initializeSocket(server);
  server.listen(PORT, () => {
    console.log(`Connceted to Express Server`);
  });
};

kaaBoom();
