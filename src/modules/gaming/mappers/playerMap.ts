import { UserProfile as PPlayer } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUserMetadata } from "../../messaging/domain/chatUser";
import { UserId } from "../../users/domain/userId";
import { GamesSummary, Player } from "../domain/player";

export type RawChatUser = Pick<
    PPlayer,
    | "id"
    | "metadata"
    | "coinBalance"
    | "displayName"
    | "userId"
    | "gamesSummary"
> &
    Partial<PPlayer>;

export class PlayerMap {
    public static toDomain(raw: RawChatUser): Player | undefined {
        const userId = UserId.create(new UniqueEntityID(raw.userId)).getValue();
        const playerOrError = Player.create(
            {
                displayName: raw.displayName || undefined,
                coinBalance: raw.coinBalance.toNumber(),
                metadata: (raw.metadata as ChatUserMetadata) || {},
                gamesSummary: (raw.metadata as GamesSummary) || {},
                userId,
            },
            new UniqueEntityID(raw.id)
        );
        return playerOrError.isSuccess ? playerOrError.getValue() : undefined;
    }

    public static toPersistence(player: Player): RawChatUser {
        return {
            id: player.playerId.id.toString(),
            userId: player.userId.id.toString(),
            displayName: player.displayName || null,
            coinBalance: new Decimal(player.coinBalance),
            metadata: player.metadata,
            gamesSummary: player.gamesSummary,
        };
    }
}
