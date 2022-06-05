import { JsonObject } from "swagger-ui-express";
import { prisma } from "../../../../infra/database/prisma/client";
import { ChatUser } from "../../domain/chatUser";
import { ChatUserMap } from "../../mappers/chatUserMap";
import { ChatUserRepo } from "../interfaces";

export class PrismaChatUserRepo implements ChatUserRepo {
    async getChatUserByUserId(userId: string): Promise<ChatUser | undefined> {
        if (!userId) return undefined;
        const chatUserEntity = await prisma.userProfile.findUnique({
            where: { userId },
        });
        if (!chatUserEntity) return undefined;

        return ChatUserMap.toDomain(chatUserEntity);
    }

    async save(chatUser: ChatUser): Promise<void> {
        const rawChatUser = ChatUserMap.toPersistence(chatUser);
        const chatUserEntity = {
            ...ChatUser,
            metadata: rawChatUser.metadata as JsonObject,
        };
        await prisma.userProfile.update({
            where: { id: rawChatUser.id },
            data: chatUserEntity,
        });
    }
}
