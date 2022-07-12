import { UserGameSummary, UserProfile as PPlayer } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUserMetadata } from "../../messaging/domain/chatUser";
import { UserId } from "../../users/domain/userId";
import { Player } from "../domain/player";
import { PlayerGameSummaries } from "../domain/playerGameSummaries";
import { GameSummaryMap } from "./gameSummaryMap";

export type RawChatUser = Pick<
    PPlayer,
    "id" | "metadata" | "coinBalance" | "displayName" | "userId"
> &
    Partial<PPlayer> & {
        user?: { username: string | null };
        gameSummaries: UserGameSummary[];
    };

export class PlayerMap {
public static toDomain(raw: RawChatUser): Player {
    const userId = UserId.create(new UniqueEntityID(raw.userId)).getValue();
        const gameSummaries = raw.gameSummaries.map(GameSummaryMap.toDomain);
        const playerGameSummaries = PlayerGameSummaries.create(gameSummaries);

        const playerOrError = Player.create(
            {
                username: raw.user?.username || undefined,
                displayName: raw.displayName || undefined,
                coinBalance: raw.coinBalance.toNumber(),
                metadata: (raw.metadata as ChatUserMetadata) || {},
                activeGameSummaries: playerGameSummaries,
                userId,
            },
            new UniqueEntityID(raw.id)
        );
        if (!playerOrError.isSuccess)
            throw new Error(playerOrError.error as string);

        return playerOrError.getValue();
    }

    public static toPersistence(player: Player): RawChatUser {
        return {
            id: player.playerId.id.toString(),
            userId: player.userId.id.toString(),
            displayName: player.displayName || null,
            coinBalance: new Decimal(player.coinBalance),
            metadata: player.metadata,
            gameSummaries: [
                ...player.activeGameSummaries
                    .getItems()
                    .map(GameSummaryMap.toPersistence),
                ...player.activeGameSummaries
                    .getRemovedItems()
                    .map(GameSummaryMap.toPersistence),
            ],
        };
    }
}
