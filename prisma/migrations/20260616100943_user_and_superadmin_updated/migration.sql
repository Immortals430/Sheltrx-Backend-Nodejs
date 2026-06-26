/*
  Warnings:

  - You are about to drop the column `SuperAdminAccessScope` on the `SuperAdmin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SuperAdmin" DROP COLUMN "SuperAdminAccessScope",
ADD COLUMN     "accessScope" "SuperAdminAccessScope" NOT NULL DEFAULT 'full';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "flag" BOOLEAN NOT NULL DEFAULT false;
