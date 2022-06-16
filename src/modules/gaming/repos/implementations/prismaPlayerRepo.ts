import { JsonObject } from "swagger-ui-express";
import { prisma } from "../../../../infra/database/prisma/client";
import { Player } from "../../domain/player";
import { PlayerMap } from "../../mappers/playerMap";
import { PlayerRepo } from "../interfaces";

export class PrismaPlayerRepo implements PlayerRepo {
    async getPlayerByUserId(userId: string): Promise<Player | undefined> {
        if (!userId) return undefined;
        const playerEntity = await prisma.userProfile.findUnique({
            where: { userId },
        });
        if (!playerEntity) return undefined;

        return PlayerMap.toDomain(playerEntity);
    }

    async save(player: Player): Promise<void> {
        const rawChatUser = PlayerMap.toPersistence(player);
        const chatUserEntity = {
            ...player,
            metadata: rawChatUser.metadata as JsonObject,
        };
        await prisma.userProfile.update({
            where: { id: rawChatUser.id },
            data: chatUserEntity,
        });
    }
}
