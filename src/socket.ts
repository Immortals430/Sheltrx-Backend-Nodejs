import http from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { connectRedis, subClient, pubClient } from "./config/redis.js";

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.adapter(createAdapter(pubClient, subClient));

  // io.use((socket, next) => {
  //   try {
  //     const token = socket.handshake.auth?.token;
  //     if (!token) {
  //       return next(new Error("Authentication token required"));
  //     }
  //     // verify token logic
  //     next();
  //   } catch {
  //     next(new Error("Invalid authentication token"));
  //   }
  // });

  io.on("connection", (socket) => {
    console.log("Adapter:", process.pid);

    socket.on("send_message", ({ message }) => {
      const payload = {
        senderId: socket.id,
        message,
        timestamp: new Date().toISOString(),
      };

      socket.broadcast.emit("receive_message", payload);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
