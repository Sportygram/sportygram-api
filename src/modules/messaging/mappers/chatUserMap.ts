import { UserProfile as PChatUser } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUser, ChatUserMetadata } from "../domain/chatUser";

export type RawChatUser = Pick<
    PChatUser,
    "id" | "metadata" | "coinBalance" | "displayName"
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
        const chatUserOrError = ChatUser.create(
            {
                displayName: raw.displayName || undefined,
                coinBalance: raw.coinBalance.toNumber(),
                metadata: (raw.metadata as ChatUserMetadata) || {},
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
            displayName: chatUser.displayName || null,
            // role: chatUser.role,
            coinBalance: new Decimal(chatUser.coinBalance),
            metadata: chatUser.metadata,
        };
    }
}
