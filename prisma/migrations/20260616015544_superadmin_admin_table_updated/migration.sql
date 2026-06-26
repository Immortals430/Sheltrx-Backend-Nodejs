-- CreateEnum
CREATE TYPE "AdminSubscriptionPlan" AS ENUM ('basic');

-- CreateEnum
CREATE TYPE "SuperAdminRoleType" AS ENUM ('admin');

-- CreateEnum
CREATE TYPE "SuperAdminAccessScope" AS ENUM ('full');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "adhaar" TEXT,
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subscriptionPlan" "AdminSubscriptionPlan" NOT NULL DEFAULT 'basic';

-- AlterTable
ALTER TABLE "SuperAdmin" ADD COLUMN     "SuperAdminAccessScope" "SuperAdminAccessScope" NOT NULL DEFAULT 'full',
ADD COLUMN     "roleType" "SuperAdminRoleType" NOT NULL DEFAULT 'admin';
