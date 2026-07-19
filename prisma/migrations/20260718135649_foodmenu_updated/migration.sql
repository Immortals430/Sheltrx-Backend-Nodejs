/*
  Warnings:

  - You are about to drop the column `hostelId` on the `MealOptOut` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MealPreference" DROP CONSTRAINT "MealPreference_tenantId_fkey";

-- AlterTable
ALTER TABLE "FoodMenu" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "MealOptOut" DROP COLUMN "hostelId";

-- AddForeignKey
ALTER TABLE "MealPreference" ADD CONSTRAINT "MealPreference_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
