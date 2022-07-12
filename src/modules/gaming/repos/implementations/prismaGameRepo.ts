import { prisma } from "../../../../infra/database/prisma/client";
import { Game } from "../../domain/game";
import { GameRepo } from "../interfaces";
import { GameMap } from "../../mappers/gameMap";
import { JsonObject } from "swagger-ui-express";

export class PrismaGameRepo implements GameRepo {
    async getGameById(id: string): Promise<Game | undefined> {
        const rawGame = await prisma.game.findUnique({
            where: {
                id,
            },
        });
        if (!rawGame) return undefined;
        return GameMap.toDomain(rawGame);
    }

    async getActiveGames(competitionId?: string): Promise<Game[]> {
        const rawGames = await prisma.game.findMany({
            where: {
                competitionId: competitionId
                    ? Number(competitionId)
                    : undefined,
                status: "in_progress",
            },
        });

        return rawGames.map(GameMap.toDomain);
    }

    async getEndedGames(): Promise<Game[]> {
        const rawGames = await prisma.game.findMany({
            where: {
                expiringAt: { lte: new Date() },
                status: "in_progress",
            },
        });

        return rawGames.map(GameMap.toDomain);
    }

    async save(game: Game): Promise<void> {
        const rawGame = GameMap.toPersistence(game);
        const gameEntity = {
            ...rawGame,
            metadata: rawGame.metadata as JsonObject,
        };

        await prisma.game.upsert({
            where: { id: rawGame.id },
            update: gameEntity,
            create: gameEntity,
        });
    }
}
