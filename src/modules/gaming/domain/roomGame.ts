import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { RoomId } from "../../messaging/domain/roomId";
import { CompetitionId } from "./competitionId";
import { RoomGameCompleted } from "./events/roomGameCompleted";
import { GameId } from "./gameId";
import { RoomGameId } from "./roomGameId";
import { GameStatus, GameType, LeaderboardPlayer } from "./types";

interface RoomGameProps {
    gameId: GameId;
    roomId: RoomId;
    competitionId: CompetitionId;
    type: string;
    status?: string;
    summary?: any;
    leaderboard: LeaderboardPlayer[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class RoomGame extends AggregateRoot<RoomGameProps> {
    get roomGameId(): RoomGameId {
        return RoomGameId.create(this._id).getValue();
    }

    get gameId(): RoomId {
        return this.props.gameId;
    }
    get roomId(): RoomId {
        return this.props.roomId;
    }
    get competitionId(): CompetitionId {
        return this.props.competitionId;
    }
    get type(): GameType {
        return this.props.type as GameType;
    }
    get status(): GameStatus {
        return this.props.status as GameStatus;
    }
    get summary() {
        return this.props.summary || {};
    }
    get leaderboard(): LeaderboardPlayer[] {
        return this.props.leaderboard;
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    private calculateSummary() {
        this.props.summary = {
            winners: [],
        };
    }

    public completeRoomGame(): Result<void> {
        if (this.status === GameStatus.Completed)
            return Result.fail("Game already completed");

        this.calculateSummary();
        this.props.status = GameStatus.Completed;
        this.addDomainEvent(new RoomGameCompleted(this));
        return Result.ok();
    }

    public updateLeaderboard(newLeaderboard: LeaderboardPlayer[]) {
        this.props.leaderboard = newLeaderboard;
    }

    private constructor(roleProps: RoomGameProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static create(
        props: RoomGameProps,
        id?: UniqueEntityID
    ): Result<RoomGame> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.roomId, argumentName: "roomId" },
            { argument: props.competitionId, argumentName: "competitionId" },
            { argument: props.type, argumentName: "type" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<RoomGame>(guardResult.message || "");
        }

        const type = props.type.toLowerCase() as GameType;
        const status = "in_progress";
        const gameTypeGuard = Guard.isValidValueOfObjectType<GameType>(
            type,
            GameType,
            "type"
        );

        if (!gameTypeGuard.succeeded) {
            return Result.fail<RoomGame>("Invalid game type");
        }

        const game = new RoomGame({ ...props, type, status }, id);
        return Result.ok<RoomGame>(game);
    }
}
