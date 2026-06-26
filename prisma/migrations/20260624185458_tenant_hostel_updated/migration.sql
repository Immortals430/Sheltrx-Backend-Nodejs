-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "hostelId" INTEGER;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
