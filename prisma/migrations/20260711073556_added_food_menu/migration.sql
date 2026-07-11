/*
  Warnings:

  - Made the column `mealTypeId` on table `FoodMenu` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FoodMenu" ALTER COLUMN "mealTypeId" SET NOT NULL;
