/*
  Warnings:

  - You are about to drop the column `scanTime` on the `MealScanLog` table. All the data in the column will be lost.
  - Added the required column `scanDate` to the `MealScanLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealScanLog" DROP COLUMN "scanTime",
ADD COLUMN     "scanDate" DATE NOT NULL;
