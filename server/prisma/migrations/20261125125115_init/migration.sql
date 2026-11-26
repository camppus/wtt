/*
  Warnings:

  - You are about to drop the `Odd` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `odds` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Odd" DROP CONSTRAINT "Odd_matchId_fkey";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "odds" JSONB NOT NULL;

-- DropTable
DROP TABLE "Odd";
