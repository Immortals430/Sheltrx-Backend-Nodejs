/*
  Warnings:

  - The primary key for the `RoomType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RoomType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `roomTypeId` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_roomTypeId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomTypeId",
ADD COLUMN     "roomTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RoomType" DROP CONSTRAINT "RoomType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
