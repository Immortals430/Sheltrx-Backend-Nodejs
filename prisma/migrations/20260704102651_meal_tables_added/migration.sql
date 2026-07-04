/*
  Warnings:

  - You are about to drop the column `foodPlan` on the `Bed` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DayCategory" AS ENUM ('weekdays', 'weekends');

-- AlterTable
ALTER TABLE "Bed" DROP COLUMN "foodPlan";

-- CreateTable
CREATE TABLE "MealPack" (
    "id" SERIAL NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "mealPackName" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "foodPlan" "FoodPlan" NOT NULL,
    "dayCategory" "DayCategory" NOT NULL,
    "mealTypeId" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPreference" (
    "id" SERIAL NOT NULL,
    "mealType" TEXT NOT NULL,
    "dayCategory" "DayCategory" NOT NULL,
    "foodPlan" "FoodPlan" NOT NULL,
    "allergies" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealType" (
    "id" SERIAL NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "mealTypeName" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuPreset" (
    "id" SERIAL NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "menuPresetName" TEXT NOT NULL,
    "menuPresetItem" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuPreset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealPack" ADD CONSTRAINT "MealPack_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealType" ADD CONSTRAINT "MealType_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPreset" ADD CONSTRAINT "MenuPreset_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
