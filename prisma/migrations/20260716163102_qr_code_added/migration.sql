-- CreateTable
CREATE TABLE "QrCode" (
    "id" TEXT NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "qrToken" TEXT NOT NULL,
    "qrUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QrCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_hostelId_key" ON "QrCode"("hostelId");
