import { ApplicationError } from "@/middleware/errorHandler.js";
import UserRepository from "./user.repository.js";
import type { CurrentUser } from "@/types/express.js";

export default class UserService {
  userRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  // async getUserById(currentUser: CurrentUser) {
  //   const user = await this.userRepository.findUserById(
  //     currentUser.userId,
  //     currentUser.role,
  //   );

  //   if (!user) {
  //     throw new ApplicationError("User not found", 404);
  //   }

  //   return user;
  // }

  // async getUserByEmail(email: string) {
  //   return await this.userRepository.findUserByEmail(email);
  // }

  //   async updatePassword(email: string, newPassword: string) {
  //     return await this.userRepository.updateUserPassword(email, newPassword);
  //   }
}
