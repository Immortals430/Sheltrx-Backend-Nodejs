/*
  Warnings:

  - You are about to drop the column `foodPlan` on the `MealPack` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `MealPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MealPack" DROP COLUMN "foodPlan";

-- AlterTable
ALTER TABLE "MealPreference" DROP COLUMN "isActive";
