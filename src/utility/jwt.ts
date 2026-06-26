// import type { Role } from "generated/prisma/enums";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "xyz";
// const isProduction = process.env.NODE_ENV === "production";

// interface JwtTokenPayload {
//   userId: number;
//   email: string;
//   role: Role;
// }

// export function createAccessToken(payload: JwtTokenPayload) {
//   return jwt.sign(payload, JWT_SECRET, {
//     expiresIn: isProduction ? "15m" : "30d",
//   });
// }


// export function verifyAccessToken(token: string) {
//   const payload = jwt.verify(token, JWT_SECRET);
//   if (typeof payload === "string") throw new Error("Invalid token");
//   return payload;
// }
