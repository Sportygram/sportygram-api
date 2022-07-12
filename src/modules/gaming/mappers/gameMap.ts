import { Game as PGame } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Game } from "../domain/game";
import { CompetitionId } from "../domain/competitionId";

export type RawGame = PGame;

export class GameMap {
    public static toDomain(raw: RawGame): Game {
        const competitionId = CompetitionId.create(
            new UniqueEntityID(raw.competitionId)
        ).getValue();
        const gameOrError = Game.create(
            {
                name: raw.name,
                description: raw.description || undefined,
                competitionId: competitionId,
                type: raw.type,
                status: raw.status,
                metadata: raw.metadata,
                expiringAt: raw.expiringAt,
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

    public static toPersistence(game: Game): RawGame {
        return {
            id: game.gameId.id.toString(),
            competitionId: Number(game.competitionId.id.toString()),
            name: game.name,
            description: game.description || null,
            type: game.type,
            status: game.status,
            metadata: game.metadata,
            expiringAt: game.expiringAt,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
        };
    }
}
