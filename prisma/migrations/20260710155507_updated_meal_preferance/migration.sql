/*
  Warnings:

  - You are about to drop the column `dayCategory` on the `MealPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MealPreference" DROP COLUMN "dayCategory",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "foodPlan" "FoodPlan"[];
