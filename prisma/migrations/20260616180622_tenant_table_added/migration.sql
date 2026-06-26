/*
  Warnings:

  - A unique constraint covering the columns `[aadhaarId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aadhaarId` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedExitDate` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joiningDate` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "aadhaarId" INTEGER NOT NULL,
ADD COLUMN     "address" JSONB,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "expectedExitDate" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "joiningDate" TEXT NOT NULL,
ADD COLUMN     "localGuardianName" TEXT,
ADD COLUMN     "localGuardianPhone" TEXT,
ADD COLUMN     "localGuardianRelation" TEXT,
ADD COLUMN     "profilePhoto" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_aadhaarId_key" ON "Tenant"("aadhaarId");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_aadhaarId_fkey" FOREIGN KEY ("aadhaarId") REFERENCES "Aadhaar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
