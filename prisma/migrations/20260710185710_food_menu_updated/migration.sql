/*
  Warnings:

  - You are about to drop the column `item` on the `FoodMenu` table. All the data in the column will be lost.
  - Added the required column `foodItem` to the `FoodMenu` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FoodMenu" DROP CONSTRAINT "FoodMenu_mealTypeId_fkey";

-- AlterTable
ALTER TABLE "FoodMenu" DROP COLUMN "item",
ADD COLUMN     "foodItem" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "FoodMenu" ADD CONSTRAINT "FoodMenu_mealTypeId_fkey" FOREIGN KEY ("mealTypeId") REFERENCES "MealType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
