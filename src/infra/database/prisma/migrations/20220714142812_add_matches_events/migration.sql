-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "events" JSONB NOT NULL DEFAULT '[]';
