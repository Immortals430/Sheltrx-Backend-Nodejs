/*
  Warnings:

  - A unique constraint covering the columns `[aadhaarId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aadhaarId` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleType` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StaffRoleType" AS ENUM ('security', 'chef', 'housekeeping');

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "aadhaarId" INTEGER NOT NULL,
ADD COLUMN     "address" JSONB,
ADD COLUMN     "alternateNumber" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "roleType" "StaffRoleType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Staff_aadhaarId_key" ON "Staff"("aadhaarId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_aadhaarId_fkey" FOREIGN KEY ("aadhaarId") REFERENCES "Aadhaar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
