import { RoomGame as PRoomGame } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { RoomId } from "../../messaging/domain/roomId";
import { Game } from "../domain/game";
import { CompetitionId } from "../domain/competitionId";
import { LeaderboardPlayer } from "../domain/types";

export type RawRoomGame = PRoomGame;

export class RoomGameMap {
    public static toDomain(raw: RawRoomGame): Game | undefined {
        const roomId = RoomId.create(new UniqueEntityID(raw.roomId)).getValue();
        const competitionId = CompetitionId.create(
            new UniqueEntityID(raw.competitionId)
        ).getValue();
        const gameOrError = Game.create(
            {
                name: raw.name,
                description: raw.description || undefined,
                roomId,
                competitionId: competitionId,
                type: raw.type,
                status: raw.status,
                summary: raw.summary || {},
                leaderboard: raw.leaderboard as LeaderboardPlayer[],
                expiringAt: raw.expiringAt,
                createdAt: raw.createdAt || undefined,
                updatedAt: raw.updatedAt || undefined,
            },
            new UniqueEntityID(raw.id)
        );
        return gameOrError.isSuccess ? gameOrError.getValue() : undefined;
    }

    public static toPersistence(game: Game): RawRoomGame {
        return {
            id: game.gameId.id.toString(),
            roomId: game.roomId.id.toString(),
            competitionId: Number(game.competitionId.id.toString()),
            name: game.name,
            description: game.description || null,
            type: game.type,
            status: game.status,
            summary: game.summary,
            leaderboard: game.leaderboard || [],
            expiringAt: game.expiringAt,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
        };
    }
}
