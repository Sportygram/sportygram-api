import { Prisma } from "@prisma/client";
import { prisma } from "../../../../infra/database/prisma/client";
import { Game } from "../../domain/game";
import { RoomGameRepo } from "../interfaces";
import { RoomGameMap } from "../../mappers/gameMap";

export class PrismaRoomGameRepo implements RoomGameRepo {
    async save(game: Game): Promise<void> {
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
