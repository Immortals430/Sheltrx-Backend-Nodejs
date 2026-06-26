-- CreateEnum
CREATE TYPE "HostelType" AS ENUM ('boys', 'girls', 'coed');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('pg', 'hostel');

-- CreateTable
CREATE TABLE "Campus" (
    "id" SERIAL NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "campusName" TEXT NOT NULL,
    "campusCode" TEXT NOT NULL,
    "address" JSONB,
    "contactPerson" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostel" (
    "id" SERIAL NOT NULL,
    "campusId" INTEGER NOT NULL,
    "hostelName" TEXT NOT NULL,
    "hostelCode" TEXT NOT NULL,
    "address" JSONB,
    "hostelType" "HostelType" NOT NULL,
    "organizationType" "OrganizationType" NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "totalFloors" INTEGER,
    "flag" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" SERIAL NOT NULL,
    "institutionName" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "adminName" TEXT,
    "adminEmail" TEXT,
    "adminPhone" TEXT,
    "logo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "comment" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdminToCampus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AdminToCampus_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HostelToWarden" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HostelToWarden_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HostelToStaff" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HostelToStaff_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AdminToCampus_B_index" ON "_AdminToCampus"("B");

-- CreateIndex
CREATE INDEX "_HostelToWarden_B_index" ON "_HostelToWarden"("B");

-- CreateIndex
CREATE INDEX "_HostelToStaff_B_index" ON "_HostelToStaff"("B");

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToCampus" ADD CONSTRAINT "_AdminToCampus_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToCampus" ADD CONSTRAINT "_AdminToCampus_B_fkey" FOREIGN KEY ("B") REFERENCES "Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HostelToWarden" ADD CONSTRAINT "_HostelToWarden_A_fkey" FOREIGN KEY ("A") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HostelToWarden" ADD CONSTRAINT "_HostelToWarden_B_fkey" FOREIGN KEY ("B") REFERENCES "Warden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HostelToStaff" ADD CONSTRAINT "_HostelToStaff_A_fkey" FOREIGN KEY ("A") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HostelToStaff" ADD CONSTRAINT "_HostelToStaff_B_fkey" FOREIGN KEY ("B") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
