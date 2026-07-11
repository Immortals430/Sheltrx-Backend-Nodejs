-- DropForeignKey
ALTER TABLE "Bed" DROP CONSTRAINT "Bed_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "MealPreference" DROP CONSTRAINT "MealPreference_tenantId_fkey";

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPreference" ADD CONSTRAINT "MealPreference_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
