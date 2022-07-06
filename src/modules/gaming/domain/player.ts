import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUserMetadata } from "../../messaging/domain/chatUser";
import { UserId } from "../../users/domain/userId";
import { PlayerId } from "./playerId";

export type GamesSummary = {
    weekly: { score: number };
    season: { score: number };
};

interface PlayerProps {
    userId: UserId;
    displayName?: string;
    coinBalance: number;
    gamesSummary: GamesSummary;
    metadata: ChatUserMetadata;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Player extends AggregateRoot<PlayerProps> {
    get playerId(): PlayerId {
        return PlayerId.create(this._id).getValue();
    }
    get userId() {
        return this.props.userId;
    }
    get displayName(): string | undefined {
        return this.props.displayName;
    }
    get coinBalance() {
        return this.props.coinBalance;
    }
    get metadata(): ChatUserMetadata {
        return this.props.metadata || { stream: { data: {} } };
    }
    get gamesSummary(): GamesSummary {
        return this.props.gamesSummary;
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    public updateWeeklyAndSeasonScores(points: number): Result<void> {
        this.props.gamesSummary.weekly.score += points;
        this.props.gamesSummary.season.score += points;
        return Result.ok();
    }

    private constructor(roleProps: PlayerProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static create(
        props: PlayerProps,
        id?: UniqueEntityID
    ): Result<Player> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.coinBalance, argumentName: "coinBalance" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Player>(guardResult.message || "");
        }

        const chatUser = new Player({ ...props }, id);

        return Result.ok<Player>(chatUser);
    }
}
