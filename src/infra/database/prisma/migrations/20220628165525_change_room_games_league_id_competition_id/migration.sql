/*
  Warnings:

  - You are about to drop the column `league_id` on the `room_games` table. All the data in the column will be lost.
  - Added the required column `competition_id` to the `room_games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_games" DROP COLUMN "league_id",
ADD COLUMN     "competition_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "competition_id_index" ON "room_games"("competition_id");

-- AddForeignKey
ALTER TABLE "room_games" ADD CONSTRAINT "room_games_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
