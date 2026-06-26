import express from "express";
import session from "express-session";
import server from "./server.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { RedisStore } from "connect-redis";
import redisClient from "./lib/redis.js";
import errorhandler from "./middleware/errorHandler.js";
import authRouter from "./features/auth/auth.routes.js";
import institutionRouter from "./features/instittution/institution.routes.js";
import userRouter from "./features/user/user.routes.js";
import campusRouter from "./features/campus/campus.routes.js";
import hostelRouter from "./features/hostel/hostel.routes.js";
import adminRouter from "./features/admin/admin.routes.js";
import wardenRouter from "./features/warden/warden.routes.js";
import staffRouter from "./features/staff/staff.routes.js";

export const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "xyz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // httpOnly: true,
      // secure: true,
      // sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/institution", institutionRouter);
app.use("/api/v1/campus", campusRouter);
app.use("/api/v1/hostel", hostelRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/warden", wardenRouter)
app.use("/api/v1/staff", staffRouter)

app.use(errorhandler);

server();
