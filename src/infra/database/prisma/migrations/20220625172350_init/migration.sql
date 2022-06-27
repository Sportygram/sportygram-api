-- CreateEnum
CREATE TYPE "AccessMode" AS ENUM ('create', 'read', 'update', 'delete', 'edit');

-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('active', 'inactive', 'deleted');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('email_verify', 'password_reset');

-- CreateEnum
CREATE TYPE "Sport" AS ENUM ('football', 'basketball', 'baseball', 'cricket', 'american_football', 'f1', 'nascar', 'running');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('unscheduled', 'scheduled', 'in_progress', 'break', 'suspended', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "RoomGameType" AS ENUM ('weekly', 'season');

-- CreateEnum
CREATE TYPE "RoomGameStatus" AS ENUM ('in_progress', 'completed');

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "access_mode" "AccessMode" NOT NULL,
    "description" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254),
    "username" VARCHAR(30),
    "phone" VARCHAR(30),
    "firstname" VARCHAR(30),
    "lastname" VARCHAR(30),
    "country" VARCHAR(2),
    "referrer" UUID,
    "referral_code" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_ip" INET,
    "last_login_time" TIMESTAMP(3),
    "user_state" "UserState" NOT NULL DEFAULT E'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_roles" (
    "role_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "display_name" TEXT,
    "onboarded" BOOLEAN NOT NULL,
    "favorite_team" TEXT,
    "profile_colour" TEXT,
    "profile_image_url" TEXT,
    "referral_count" INTEGER NOT NULL DEFAULT 0,
    "coinBalance" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "gamesSummary" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "room_type" TEXT NOT NULL DEFAULT E'public',
    "room_image_url" TEXT,
    "joining_fee" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms_chat_users" (
    "room_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "competitions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "country" VARCHAR(30) NOT NULL,
    "country_code" VARCHAR(2) NOT NULL,
    "season" TEXT NOT NULL,
    "sources" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "sources" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams_competitions" (
    "team_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "nationality" TEXT,
    "photo" TEXT,
    "sources" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams_athletes" (
    "team_id" INTEGER NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "status" "MatchStatus" NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "periods" JSONB NOT NULL DEFAULT '{}',
    "season" TEXT NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "venue" TEXT NOT NULL,
    "winner" TEXT,
    "summary" JSONB NOT NULL DEFAULT '{}',
    "sources" JSONB NOT NULL DEFAULT '{}',
    "questions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches_teams" (
    "team_id" INTEGER NOT NULL,
    "match_id" UUID NOT NULL,
    "formation" TEXT,
    "colours" JSONB NOT NULL DEFAULT '{}',
    "lineup" JSONB NOT NULL DEFAULT '{}',
    "sources" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "user_match_predictions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "points" INTEGER NOT NULL,
    "predictions" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_match_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_games" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "room_id" UUID NOT NULL,
    "league_id" UUID NOT NULL,
    "type" "RoomGameType" NOT NULL,
    "status" "RoomGameStatus" NOT NULL,
    "leaderboard" JSONB NOT NULL DEFAULT '[]',
    "summary" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiring_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "room_games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_id_permission_id_unique" ON "roles_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_referral_code_key" ON "users"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "role_id_user_id_unique" ON "users_roles"("role_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_id_user_id_unique" ON "rooms_chat_users"("room_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_id_competition_id_unique" ON "teams_competitions"("team_id", "competition_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_id_athlete_id_unique" ON "teams_athletes"("team_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_id_match_id_unique" ON "matches_teams"("team_id", "match_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_match_id_unique" ON "user_match_predictions"("user_id", "match_id");

-- CreateIndex
CREATE INDEX "room_id_index" ON "room_games"("room_id");

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms_chat_users" ADD CONSTRAINT "rooms_chat_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms_chat_users" ADD CONSTRAINT "rooms_chat_users_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_competitions" ADD CONSTRAINT "teams_competitions_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_competitions" ADD CONSTRAINT "teams_competitions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_athletes" ADD CONSTRAINT "teams_athletes_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_athletes" ADD CONSTRAINT "teams_athletes_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches_teams" ADD CONSTRAINT "matches_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches_teams" ADD CONSTRAINT "matches_teams_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_match_predictions" ADD CONSTRAINT "user_match_predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_match_predictions" ADD CONSTRAINT "user_match_predictions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_games" ADD CONSTRAINT "room_games_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
