-- CreateEnum
CREATE TYPE "BetPickStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'VOID');

-- AlterTable
ALTER TABLE "BetPick" ADD COLUMN     "status" "BetPickStatus" NOT NULL DEFAULT 'PENDING';
