-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('DEPOSIT', 'BET_STAKE', 'BET_WIN', 'BET_REFUND', 'WITHDRAWAL', 'WITHDRAWAL_REFUND', 'FEE');

-- CreateEnum
CREATE TYPE "LedgerEntryDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LedgerEntryType" NOT NULL,
    "direction" "LedgerEntryDirection" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "balanceBefore" DECIMAL(18,2) NOT NULL,
    "balanceAfter" DECIMAL(18,2) NOT NULL,
    "referenceId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_createdAt_idx" ON "LedgerEntry"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_type_createdAt_idx" ON "LedgerEntry"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_direction_createdAt_idx" ON "LedgerEntry"("userId", "direction", "createdAt");

-- CreateIndex
CREATE INDEX "LedgerEntry_referenceId_idx" ON "LedgerEntry"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_type_referenceId_key" ON "LedgerEntry"("type", "referenceId");

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
