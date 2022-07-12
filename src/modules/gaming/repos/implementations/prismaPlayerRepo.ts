import { JsonObject } from "swagger-ui-express";
import { prisma } from "../../../../infra/database/prisma/client";
import { Game } from "../../domain/game";
import { Player } from "../../domain/player";
import { GameSummaryMap } from "../../mappers/gameSummaryMap";
import { PlayerMap } from "../../mappers/playerMap";
import { PlayerRepo } from "../interfaces";

export class PrismaPlayerRepo implements PlayerRepo {
    // @id @default(dbgenerated("public.uuid_generate_v4()"))
    async createAllUserGameSummaries(game: Game): Promise<number> {
        const count = await prisma.$executeRaw`
        INSERT INTO user_game_summaries(
            id, user_id, competition_id, 
            summary, updated_at, created_at,
            game_id, score, status, type)
        SELECT 
            public.gen_random_uuid(), id, ${Number(
                game.competitionId.id.toString()
            )},
            '{}', NOW(), NOW(), 
            uuid(${game.id.toString()}), 0, 'in_progress', 'weekly'
            FROM users;`;
        return count;
    }

    async getAllPlayers(gameId?: string): Promise<Player[]> {
        const playerEntities = await prisma.userProfile.findMany({
            include: {
                user: { select: { username: true } },
                gameSummaries: {
                    where: { status: "in_progress", gameId },
                },
            },
        });

        return playerEntities.map(PlayerMap.toDomain);
    }

    async getPlayerByUserId(userId: string): Promise<Player | undefined> {
        if (!userId) return undefined;
        const playerEntity = await prisma.userProfile.findUnique({
            where: { userId },
            include: {
                user: { select: { username: true } },
                gameSummaries: {
                    where: { status: "in_progress" },
                },
            },
        });
        if (!playerEntity) return undefined;

        return PlayerMap.toDomain(playerEntity);
    }

    async save(player: Player): Promise<void> {
        const rawPlayer = PlayerMap.toPersistence(player);
        const chatUserEntity = {
            ...rawPlayer,
            metadata: rawPlayer.metadata as JsonObject,
            gameSummaries: {
                createMany: {
                    data: player.activeGameSummaries.getNewItems().map((gs) => {
                        const gsP = GameSummaryMap.toPersistence(gs);
                        return {
                            ...gsP,
                            summary: gsP.summary as JsonObject,
                            playerId: undefined,
                        };
                    }),
                },
                updateMany: player.activeGameSummaries.getItems().map((gs) => {
                    const gsP = GameSummaryMap.toPersistence(gs);
                    return {
                        where: {
                            id: gsP.id,
                        },
                        data: {
                            ...gsP,
                            summary: gsP.summary as JsonObject,
                            playerId: undefined,
                        },
                    };
                }),
                deleteMany: player.activeGameSummaries
                    .getRemovedItems()
                    .map((gs) => {
                        return {
                            id: gs.id.toString(),
                        };
                    }),
            },
            userId: undefined,
            settings: undefined,
            user: undefined,
        };

        await prisma.userProfile.update({
            where: { id: rawPlayer.id },
            data: chatUserEntity,
        });
    }
}
