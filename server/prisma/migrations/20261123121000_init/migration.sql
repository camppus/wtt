/*
  Warnings:

  - You are about to alter the column `amount` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `fee` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[externalReference]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `scores` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransationsMehtod" AS ENUM ('IBAN', 'EXPRESS');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "payment_userId_externalReference_idx";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "scores",
ADD COLUMN     "scores" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "fee" SET DATA TYPE DECIMAL(12,2);

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "Widthdrawls" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "fee" DECIMAL(12,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "coordnate" TEXT NOT NULL,
    "method" "TransationsMehtod" NOT NULL,
    "replayedById" TEXT,
    "fileUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Widthdrawls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_externalReference_key" ON "payment"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "payment_idempotencyKey_key" ON "payment"("idempotencyKey");

-- AddForeignKey
ALTER TABLE "Widthdrawls" ADD CONSTRAINT "Widthdrawls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
