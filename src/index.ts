import express from "express";
import session from "express-session";
import server from "./server.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { RedisStore } from "connect-redis";
import redisClient from "./lib/redis.js";
import errorhandler from "./middleware/errorHandler.js";
import authRouter from "./features/auth/auth.routes.js";
import institutionRouter from "./features/organizationFeatures/instittution/institution.routes.js";
import userRouter from "./features/userFeatures/user/user.routes.js";
import campusRouter from "./features/organizationFeatures/campus/campus.routes.js";
import hostelRouter from "./features/organizationFeatures/hostel/hostel.routes.js";
import adminRouter from "./features/userFeatures/admin/admin.routes.js";
import wardenRouter from "./features/userFeatures/warden/warden.routes.js";
import staffRouter from "./features/userFeatures/staff/staff.routes.js";
import roomRouter from "./features/organizationFeatures/room/room.routes.js";
import roomTypeRouter from "./features/organizationFeatures/roomType/roomType.routes.js";
import bedRouter from "./features/organizationFeatures/bed/bed.routes.js";
import mealTypeRouter from "./features/mealFeatures/mealType/mealType.routes.js";
import mealPackRouter from "./features/mealFeatures/mealPack/mealPack.routes.js";
import mealPreferenceRouter from "./features/mealFeatures/mealPreference/mealPreference.routes.js";
import menuPresetRouter from "./features/mealFeatures/menuPreset/menuPreset.routes.js";
import foodMenuRouter from "./features/mealFeatures/foodMenu/foodMenu.routes.js";

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
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/warden", wardenRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/institution", institutionRouter);
app.use("/api/v1/campus", campusRouter);
app.use("/api/v1/hostel", hostelRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/room-type", roomTypeRouter);
app.use("/api/v1/bed", bedRouter);
app.use("/api/v1/menu-preset", menuPresetRouter);
app.use("/api/v1/food-menu", foodMenuRouter);
app.use("/api/v1/meal-type", mealTypeRouter);
app.use("/api/v1/meal-pack", mealPackRouter);
app.use("/api/v1/meal-preference", mealPreferenceRouter);

app.use(errorhandler);

server();
