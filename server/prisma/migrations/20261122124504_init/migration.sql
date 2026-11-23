/*
  Warnings:

  - You are about to drop the column `isPhoneVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totalDisponible` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PhoneVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'FAILED');

-- DropForeignKey
ALTER TABLE "PhoneVerification" DROP CONSTRAINT "PhoneVerification_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPhoneVerified",
DROP COLUMN "totalDisponible";

-- DropTable
DROP TABLE "PhoneVerification";

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "externalReference" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "fee" DOUBLE PRECISION NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_reference_key" ON "payment"("reference");

-- CreateIndex
CREATE INDEX "payment_userId_status_idx" ON "payment"("userId", "status");

-- CreateIndex
CREATE INDEX "payment_userId_externalReference_idx" ON "payment"("userId", "externalReference");

-- CreateIndex
CREATE INDEX "payment_status_expiresAt_idx" ON "payment"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "payment_amount_status_idx" ON "payment"("amount", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_userId_idempotencyKey_key" ON "payment"("userId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
