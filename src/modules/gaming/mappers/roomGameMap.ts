import { RoomGame as PRoomGame } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { RoomId } from "../../messaging/domain/roomId";
import { CompetitionId } from "../domain/competitionId";
import { GameId } from "../domain/gameId";
import { RoomGame } from "../domain/roomGame";
import { LeaderboardPlayer } from "../domain/types";

export type RawRoomGame = PRoomGame;

export class RoomGameMap {
    public static toDomain(raw: RawRoomGame): RoomGame {
        const roomId = RoomId.create(new UniqueEntityID(raw.roomId)).getValue();
        const gameId = GameId.create(new UniqueEntityID(raw.gameId)).getValue();
        const competitionId = CompetitionId.create(
            new UniqueEntityID(raw.competitionId)
        ).getValue();
        const gameOrError = RoomGame.create(
            {
                gameId,
                competitionId,
                roomId,
                type: raw.type,
                status: raw.status,
                summary: raw.summary || {},
                leaderboard: raw.leaderboard as LeaderboardPlayer[],
                createdAt: raw.createdAt || undefined,
                updatedAt: raw.updatedAt || undefined,
            },
            new UniqueEntityID(raw.id)
        );

        if (!gameOrError.isSuccess) {
            throw new Error(gameOrError.error as string);
        }
        return gameOrError.getValue();
    }

    public static toPersistence(game: RoomGame): RawRoomGame {
        return {
            id: game.roomGameId.id.toString(),
            roomId: game.roomId.id.toString(),
            gameId: game.gameId.id.toString(),
            competitionId: Number(game.competitionId.id.toString()),
            type: game.type,
            status: game.status,
            summary: game.summary,
            leaderboard: game.leaderboard || [],
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
        };
    }
}
