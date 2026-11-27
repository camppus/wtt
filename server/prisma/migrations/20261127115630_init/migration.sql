/*
  Warnings:

  - The values [COMPLETED,CANCELLED] on the enum `ProgressionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [VOID] on the enum `ProgressionStepStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProgressionStatus_new" AS ENUM ('ACTIVE', 'LOOPING', 'FAILED');
ALTER TABLE "BettingProgression" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BettingProgression" ALTER COLUMN "status" TYPE "ProgressionStatus_new" USING ("status"::text::"ProgressionStatus_new");
ALTER TYPE "ProgressionStatus" RENAME TO "ProgressionStatus_old";
ALTER TYPE "ProgressionStatus_new" RENAME TO "ProgressionStatus";
DROP TYPE "ProgressionStatus_old";
ALTER TABLE "BettingProgression" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProgressionStepStatus_new" AS ENUM ('PENDING', 'WON', 'LOST');
ALTER TABLE "BettingProgressionStep" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BettingProgressionStep" ALTER COLUMN "status" TYPE "ProgressionStepStatus_new" USING ("status"::text::"ProgressionStepStatus_new");
ALTER TYPE "ProgressionStepStatus" RENAME TO "ProgressionStepStatus_old";
ALTER TYPE "ProgressionStepStatus_new" RENAME TO "ProgressionStepStatus";
DROP TYPE "ProgressionStepStatus_old";
ALTER TABLE "BettingProgressionStep" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
