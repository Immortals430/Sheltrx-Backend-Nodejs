-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "roleType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "expectedExitDate" DROP NOT NULL;
