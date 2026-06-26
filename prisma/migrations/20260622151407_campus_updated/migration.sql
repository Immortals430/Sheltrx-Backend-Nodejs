/*
  Warnings:

  - Made the column `address` on table `Campus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Campus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Campus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Campus` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Campus" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Campus_institutionId_createdAt_idx" ON "Campus"("institutionId", "createdAt");
