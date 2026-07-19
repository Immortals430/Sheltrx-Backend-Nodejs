/*
  Warnings:

  - Added the required column `hostelId` to the `MealOptOut` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealOptOut" ADD COLUMN     "hostelId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MealScanLog" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "mealTypeId" INTEGER NOT NULL,
    "scanTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealScanLog_pkey" PRIMARY KEY ("id")
);
