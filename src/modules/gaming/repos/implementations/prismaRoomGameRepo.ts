import { Prisma } from "@prisma/client";
import { prisma } from "../../../../infra/database/prisma/client";
import { RoomGameRepo } from "../interfaces";
import { Player } from "../../domain/player";
import { PlayerMap } from "../../mappers/playerMap";
import { RoomGameMap } from "../../mappers/roomGameMap";
import { RoomGame } from "../../domain/roomGame";

export class PrismaRoomGameRepo implements RoomGameRepo {
    async getRoomGamesByGameId(gameId: string): Promise<RoomGame[]> {
        const rawGames = await prisma.roomGame.findMany({
            where: {
                gameId,
                status: "in_progress",
            },
        });

        return rawGames.map(RoomGameMap.toDomain);
    }

    async getLiveRoomGames(
        competitionId?: string,
        roomId?: string
    ): Promise<RoomGame[]> {
        const rawGames = await prisma.roomGame.findMany({
            where: {
                competitionId: competitionId
                    ? Number(competitionId)
                    : undefined,
                roomId,
                status: "in_progress",
            },
        });

        return rawGames.map(RoomGameMap.toDomain);
    }

    async getRoomPlayers(roomId: string, gameId?: string): Promise<Player[]> {
        const rawPlayers = await prisma.roomChatUser.findMany({
            where: { roomId },
            include: {
                chatUser: {
                    select: {
                        id: true,
                        userId: true,
                        displayName: true,
                        coinBalance: true,
                        metadata: true,
                        createdAt: true,
                        updatedAt: true,
                        user: { select: { username: true } },
                        gameSummaries: {
                            where: { gameId },
                        },
                    },
                },
            },
        });

        return rawPlayers.map((rp) => PlayerMap.toDomain(rp.chatUser));
    }

    async save(game: RoomGame): Promise<void> {
        const rawGame = RoomGameMap.toPersistence(game);
        const gameEntity = {
            ...rawGame,
            summary: rawGame.summary as Prisma.JsonObject,
            leaderboard: rawGame.leaderboard as Prisma.JsonObject,
        };
        await prisma.roomGame.upsert({
            where: { id: rawGame.id },
            update: gameEntity,
            create: gameEntity,
        });
    }
}
