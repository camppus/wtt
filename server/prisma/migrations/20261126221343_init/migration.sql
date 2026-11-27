/*
  Warnings:

  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProgressionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProgressionStepStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'VOID');

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_userId_fkey";

-- DropIndex
DROP INDEX "BetSlip_userId_idx";

-- DropIndex
DROP INDEX "Message_chatId_isRead_senderId_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropTable
DROP TABLE "payment";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "externalReference" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "fee" DECIMAL(12,2) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BettingProgression" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "status" "ProgressionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BettingProgression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BettingProgressionStep" (
    "id" TEXT NOT NULL,
    "progressionId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "status" "ProgressionStepStatus" NOT NULL DEFAULT 'PENDING',
    "betId" TEXT,
    "stakeAmount" DECIMAL(18,2) NOT NULL,
    "payoutAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BettingProgressionStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalReference_key" ON "Payment"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_idempotencyKey_key" ON "Payment"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Payment_userId_status_createdAt_idx" ON "Payment"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_status_expiresAt_idx" ON "Payment"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "Payment_userId_createdAt_idx" ON "Payment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_provider_status_idx" ON "Payment"("provider", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_userId_idempotencyKey_key" ON "Payment"("userId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "BettingProgression_userId_status_idx" ON "BettingProgression"("userId", "status");

-- CreateIndex
CREATE INDEX "BettingProgression_userId_status_createdAt_idx" ON "BettingProgression"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "BettingProgression_status_createdAt_idx" ON "BettingProgression"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BettingProgressionStep_betId_key" ON "BettingProgressionStep"("betId");

-- CreateIndex
CREATE INDEX "BettingProgressionStep_progressionId_status_idx" ON "BettingProgressionStep"("progressionId", "status");

-- CreateIndex
CREATE INDEX "BettingProgressionStep_progressionId_stepNumber_idx" ON "BettingProgressionStep"("progressionId", "stepNumber");

-- CreateIndex
CREATE INDEX "BettingProgressionStep_status_createdAt_idx" ON "BettingProgressionStep"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BettingProgressionStep_progressionId_stepNumber_key" ON "BettingProgressionStep"("progressionId", "stepNumber");

-- CreateIndex
CREATE INDEX "BetPick_matchId_idx" ON "BetPick"("matchId");

-- CreateIndex
CREATE INDEX "BetPick_matchId_oddType_idx" ON "BetPick"("matchId", "oddType");

-- CreateIndex
CREATE INDEX "BetPick_betSlipId_idx" ON "BetPick"("betSlipId");

-- CreateIndex
CREATE INDEX "BetSlip_userId_createdAt_idx" ON "BetSlip"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "BetSlip_userId_status_createdAt_idx" ON "BetSlip"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "BetSlip_status_createdAt_idx" ON "BetSlip"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BetSlip_status_resolvedAt_idx" ON "BetSlip"("status", "resolvedAt");

-- CreateIndex
CREATE INDEX "Challenge_userId_context_isUsed_expiresAt_idx" ON "Challenge"("userId", "context", "isUsed", "expiresAt");

-- CreateIndex
CREATE INDEX "Chat_userId_createdAt_idx" ON "Chat"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Chat_adminId_createdAt_idx" ON "Chat"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "Match_status_startAt_idx" ON "Match"("status", "startAt");

-- CreateIndex
CREATE INDEX "Match_status_completed_idx" ON "Match"("status", "completed");

-- CreateIndex
CREATE INDEX "Match_startAt_idx" ON "Match"("startAt");

-- CreateIndex
CREATE INDEX "Match_key_idx" ON "Match"("key");

-- CreateIndex
CREATE INDEX "Message_chatId_isRead_createdAt_idx" ON "Message"("chatId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_type_createdAt_idx" ON "Notification"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_isActive_role_idx" ON "User"("isActive", "role");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "Widthdrawls_userId_createdAt_idx" ON "Widthdrawls"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Widthdrawls_userId_status_createdAt_idx" ON "Widthdrawls"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Widthdrawls_status_createdAt_idx" ON "Widthdrawls"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Widthdrawls_method_status_idx" ON "Widthdrawls"("method", "status");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BettingProgression" ADD CONSTRAINT "BettingProgression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BettingProgressionStep" ADD CONSTRAINT "BettingProgressionStep_progressionId_fkey" FOREIGN KEY ("progressionId") REFERENCES "BettingProgression"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BettingProgressionStep" ADD CONSTRAINT "BettingProgressionStep_betId_fkey" FOREIGN KEY ("betId") REFERENCES "BetSlip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
