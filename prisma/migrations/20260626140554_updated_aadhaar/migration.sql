/*
  Warnings:

  - Made the column `createdAt` on table `Aadhaar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Aadhaar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Aadhaar" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
