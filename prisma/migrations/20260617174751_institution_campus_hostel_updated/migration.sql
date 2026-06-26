/*
  Warnings:

  - You are about to drop the column `createAt` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Hostel` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Hostel` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Institution` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Institution` table. All the data in the column will be lost.
  - The `address` column on the `Institution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Campus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Hostel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Institution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campus" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Hostel" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "address",
ADD COLUMN     "address" JSONB;
