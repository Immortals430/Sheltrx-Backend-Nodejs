import type { CurrentUser } from "@/types/express";
import type { CreateFoodMenu, FoodMenuQueries } from "./foodMenu.validator";
import { Prisma } from "generated/prisma/client";
import FoodMenuRepository from "./foodMenu.repository";
import { ApplicationError } from "@/middleware/errorHandler";
import UserService from "../../userFeatures/user/user.service";
import HostelRepository from "../../organizationFeatures/hostel/hostel.repository";
import MealTypeRepository from "../mealType/mealType.repository";
import MenuPresetRepository from "../menuPreset/menuPreset.repository";
import type { JsonValue } from "@prisma/client/runtime/client";

export default class FoodMenuService {
  foodMenuRepository;
  userService;
  hostelRepository;
  mealTypeRepository;
  menuPresetRepository;

  constructor() {
    this.foodMenuRepository = new FoodMenuRepository();
    this.userService = new UserService();
    this.hostelRepository = new HostelRepository();
    this.mealTypeRepository = new MealTypeRepository();
    this.menuPresetRepository = new MenuPresetRepository();
  }

  async getFoodMenus(queries: FoodMenuQueries, currentUser: CurrentUser) {
    const filters: Prisma.MealTypeWhereInput = {
      // ...(currentUser.role === "admin" && )
    };

    const mealType = await this.mealTypeRepository.getMealTypes({
      filters,
    });

    return mealType;
  }

  async createFoodMenu(payload: CreateFoodMenu, currentUser: CurrentUser) {
    const hostel = await this.hostelRepository.getHostelDetail(
      payload.hostelId,
    );

    if (!hostel) throw new ApplicationError("Hostel not found", 404);

    const mealType = await this.mealTypeRepository.getMealTypeDetail(
      payload.mealTypeId,
    );

    if (!mealType || mealType.hostelId !== payload.hostelId)
      throw new ApplicationError("Meal type not found in this hostel", 404);

    const exisitnigFoodMenu =
      await this.foodMenuRepository.getExisitingFoodMenuDetail(
        payload.mealTypeId,
        payload.date,
      );

    if (exisitnigFoodMenu) {
      throw new ApplicationError("Food menu already exist", 409);
    }

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        payload.hostelId,
        currentUser.userId,
      );
    }

    type MenuPresetItemShape = { veg: string[]; nonVeg: string[] };

    let presetItem: MenuPresetItemShape | undefined;

    if (payload.menuPresetId) {
      const menuPreset = await this.menuPresetRepository.getMenuPresetDetail(
        payload.menuPresetId,
      );

      if (!menuPreset || menuPreset.hostelId !== payload.hostelId)
        throw new ApplicationError("Menu preset not found in this hostel", 404);

      presetItem = menuPreset.menuPresetItem as unknown as MenuPresetItemShape;
    }

    const foodMenu = await this.foodMenuRepository.createFoodMenu({
      hostelId: payload.hostelId,
      mealTypeId: payload.mealTypeId,
      foodItem: {
        veg: presetItem?.veg ?? payload.customFoodItem?.veg ?? [],
        nonVeg: presetItem?.nonVeg ?? payload.customFoodItem?.nonVeg ?? [],
      },
      date: payload.date,
    });

    return foodMenu;
  }










  

  async deleteFoodMenu(foodMenuId: number, currentUser: CurrentUser) {
    const foodMenu = await this.foodMenuRepository.getFoodMenuDetail({
      foodMenuId,
    });

    if (!foodMenu) throw new ApplicationError("Food menu not found", 404);

    if (currentUser.role === "admin") {
      await this.userService.validateHostelAccessForAdmin(
        foodMenu.hostelId,
        currentUser.userId,
      );
    }

    const deletedFoodMenu =
      await this.foodMenuRepository.deleteFoodMenu(foodMenuId);

    return deletedFoodMenu;
  }
}
