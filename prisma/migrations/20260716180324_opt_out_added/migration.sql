-- CreateTable
CREATE TABLE "MealOptOut" (
    "id" TEXT NOT NULL,
    "mealTypeId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealOptOut_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealOptOut" ADD CONSTRAINT "MealOptOut_mealTypeId_fkey" FOREIGN KEY ("mealTypeId") REFERENCES "MealType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
