import { hash, compare } from "bcrypt";
import { ApplicationError } from "@/middleware/errorHandler.js";

export const hashPassword = async (password: string) => {
  const passwordIsValid =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[a-zA-Z0-9\W_]{8,}$/.test(
      password,
    );
  if (!passwordIsValid) {
    throw new ApplicationError(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      400,
    );
  }
  return await hash(password, 10);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  const passwordIsValid = await compare(plainPassword, hashedPassword);
  if (!passwordIsValid) {
    throw new ApplicationError("Incorrect password", 401);
  }
  return passwordIsValid;
};
