/*
  Warnings:

  - You are about to drop the column `adhaar` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aadhaarId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aadhaarId]` on the table `Warden` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aadhaarId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aadhaarId` to the `Warden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Warden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePhoto` to the `Warden` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "adhaar",
ADD COLUMN     "aadhaarId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Warden" ADD COLUMN     "aadhaarId" INTEGER NOT NULL,
ADD COLUMN     "address" JSONB,
ADD COLUMN     "alternateNumber" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "dob" DATE,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "profilePhoto" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Aadhaar" (
    "id" SERIAL NOT NULL,
    "aadhaarNumber" TEXT,
    "adhaarVerified" BOOLEAN NOT NULL DEFAULT false,
    "adhaarTxnId" TEXT,
    "verificationDate" TEXT,

    CONSTRAINT "Aadhaar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_aadhaarId_key" ON "Admin"("aadhaarId");

-- CreateIndex
CREATE UNIQUE INDEX "Warden_aadhaarId_key" ON "Warden"("aadhaarId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_aadhaarId_fkey" FOREIGN KEY ("aadhaarId") REFERENCES "Aadhaar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warden" ADD CONSTRAINT "Warden_aadhaarId_fkey" FOREIGN KEY ("aadhaarId") REFERENCES "Aadhaar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
