import { UserProfile as PChatUser } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { UserId } from "../../users/domain/userId";
import { ChatUser, ChatUserMetadata } from "../domain/chatUser";

export type RawChatUser = Pick<
    PChatUser,
    "id" | "metadata" | "coinBalance" | "displayName" | "userId"
> &
    Partial<PChatUser>;

export class ChatUserMap {
    // public static toDTO(chatUser: ChatUser): ChatUserDTO {
    //     return {
    //         id: chatUser.chatUserId.id.toString(),
    //         name: chatUser.name,
    //         description: chatUser.description,
    //     };
    // }

    public static toDomain(raw: RawChatUser): ChatUser | undefined {
        const userId = UserId.create(new UniqueEntityID(raw.userId)).getValue();
        const chatUserOrError = ChatUser.create(
            {
                displayName: raw.displayName || undefined,
                coinBalance: raw.coinBalance.toNumber(),
                metadata: (raw.metadata as ChatUserMetadata) || {},
                userId,
            },
            new UniqueEntityID(raw.id)
        );
        return chatUserOrError.isSuccess
            ? chatUserOrError.getValue()
            : undefined;
    }

    public static toPersistence(chatUser: ChatUser): RawChatUser {
        return {
            id: chatUser.chatUserId.id.toString(),
            userId: chatUser.userId.id.toString(),
            displayName: chatUser.displayName || null,
            // role: chatUser.role,
            coinBalance: new Decimal(chatUser.coinBalance),
            metadata: chatUser.metadata,
        };
    }
}
