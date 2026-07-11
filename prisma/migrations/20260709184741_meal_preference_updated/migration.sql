/*
  Warnings:

  - You are about to drop the column `mealPackId` on the `MealPreference` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MealPreference" DROP CONSTRAINT "MealPreference_mealPackId_fkey";

-- AlterTable
ALTER TABLE "MealPreference" DROP COLUMN "mealPackId";

-- CreateTable
CREATE TABLE "_MealPackToMealPreference" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MealPackToMealPreference_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MealPackToMealPreference_B_index" ON "_MealPackToMealPreference"("B");

-- AddForeignKey
ALTER TABLE "_MealPackToMealPreference" ADD CONSTRAINT "_MealPackToMealPreference_A_fkey" FOREIGN KEY ("A") REFERENCES "MealPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealPackToMealPreference" ADD CONSTRAINT "_MealPackToMealPreference_B_fkey" FOREIGN KEY ("B") REFERENCES "MealPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
