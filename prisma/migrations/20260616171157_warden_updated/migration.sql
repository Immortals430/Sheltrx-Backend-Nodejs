/*
  Warnings:

  - A unique constraint covering the columns `[aadhaarNumber]` on the table `Aadhaar` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dob` on table `Warden` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Warden" ALTER COLUMN "dob" SET NOT NULL,
ALTER COLUMN "dob" SET DATA TYPE TEXT,
ALTER COLUMN "profilePhoto" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Aadhaar_aadhaarNumber_key" ON "Aadhaar"("aadhaarNumber");
