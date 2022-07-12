import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { Entity } from "../../../lib/domain/Entity";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { CompetitionId } from "./competitionId";
import { GameId } from "./gameId";
import { PlayerId } from "./playerId";
import { GameStatus, GameType } from "./types";

interface GameSummaryProps {
    type: GameType;
    status?: GameStatus;
    gameId: GameId;
    playerId: PlayerId;
    competitionId: CompetitionId;
    score?: number;
    summary?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export class PlayerGameSummary extends Entity<GameSummaryProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get gameId(): GameId {
        return this.props.gameId;
    }
    get playerId(): PlayerId {
        return this.props.playerId;
    }
    get competitionId(): CompetitionId {
        return this.props.competitionId;
    }

    get type(): GameType {
        return this.props.type as GameType;
    }
    get status(): GameStatus {
        return (this.props.status as GameStatus) || GameStatus.InProgress;
    }
    get score() {
        return this.props.score || 0;
    }
    get summary() {
        return this.props.summary || {};
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    public isComplete(): boolean {
        return this.status === GameStatus.Completed;
    }

    private calculateSummary() {
        this.props.summary = {};
    }

    public completeGame() {
        this.calculateSummary();
        this.props.status = GameStatus.Completed;
    }
    public increaseScore(points: number) {
        this.props.score = this.score + points;
    }

    private constructor(props: GameSummaryProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: GameSummaryProps,
        id?: UniqueEntityID
    ): Result<PlayerGameSummary> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.playerId, argumentName: "playerId" },
            { argument: props.competitionId, argumentName: "competitionId" },
            { argument: props.type, argumentName: "type" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<PlayerGameSummary>(guardResult.message || "");
        }

        return Result.ok<PlayerGameSummary>(new PlayerGameSummary(props, id));
    }
}
