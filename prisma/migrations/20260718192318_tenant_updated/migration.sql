/*
  Warnings:

  - The `expectedExitDate` column on the `Tenant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `joiningDate` column on the `Tenant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "expectedExitDate",
ADD COLUMN     "expectedExitDate" DATE NOT NULL DEFAULT '9999-12-31'::date,
DROP COLUMN "joiningDate",
ADD COLUMN     "joiningDate" DATE NOT NULL DEFAULT '2026-07-18'::date;
