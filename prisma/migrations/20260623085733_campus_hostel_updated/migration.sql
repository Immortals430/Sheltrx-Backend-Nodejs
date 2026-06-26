-- DropForeignKey
ALTER TABLE "Campus" DROP CONSTRAINT "Campus_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Hostel" DROP CONSTRAINT "Hostel_campusId_fkey";

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
