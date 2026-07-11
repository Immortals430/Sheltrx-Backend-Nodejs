import { ApplicationError } from "@/middleware/errorHandler.js";
import UserRepository from "./user.repository.js";
import type { CurrentUser } from "@/types/express.js";
import HostelRepository from "../../organizationFeatures/hostel/hostel.repository.js";

export default class UserService {
  userRepository;
  hostelRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.hostelRepository = new HostelRepository();
  }

  async validateHostelAccessForAdmin(hostelId: number, userId: number) {
    const hostel = await this.hostelRepository.getAdminHostel(hostelId, userId);

    if (!hostel)
      throw new ApplicationError("Cannot perform action for other hostel", 403);
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
