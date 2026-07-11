/*
  Warnings:

  - You are about to drop the column `mealTypeId` on the `MealPack` table. All the data in the column will be lost.
  - You are about to drop the column `allergies` on the `MealPreference` table. All the data in the column will be lost.
  - You are about to drop the column `foodPlan` on the `MealPreference` table. All the data in the column will be lost.
  - You are about to drop the column `mealType` on the `MealPreference` table. All the data in the column will be lost.
  - Added the required column `mealPackId` to the `MealPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `MealPreference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealPack" DROP COLUMN "mealTypeId";

-- AlterTable
ALTER TABLE "MealPreference" DROP COLUMN "allergies",
DROP COLUMN "foodPlan",
DROP COLUMN "mealType",
ADD COLUMN     "mealPackId" INTEGER NOT NULL,
ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MealType" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "_MealPackToMealType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MealPackToMealType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MealPackToMealType_B_index" ON "_MealPackToMealType"("B");

-- AddForeignKey
ALTER TABLE "MealPreference" ADD CONSTRAINT "MealPreference_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPreference" ADD CONSTRAINT "MealPreference_mealPackId_fkey" FOREIGN KEY ("mealPackId") REFERENCES "MealPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealPackToMealType" ADD CONSTRAINT "_MealPackToMealType_A_fkey" FOREIGN KEY ("A") REFERENCES "MealPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealPackToMealType" ADD CONSTRAINT "_MealPackToMealType_B_fkey" FOREIGN KEY ("B") REFERENCES "MealType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
