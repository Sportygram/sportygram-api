-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "settings" SET DEFAULT '{}',
ALTER COLUMN "gamesSummary" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
