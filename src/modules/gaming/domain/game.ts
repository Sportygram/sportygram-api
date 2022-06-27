import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { RoomId } from "../../messaging/domain/roomId";
import { GameId } from "./gameId";
import { LeagueId } from "./leagueId";
import { LeaderboardPlayer } from "./types";

interface GameProps {
    name: string;
    description: string;
    roomId: RoomId;
    leagueId: LeagueId;
    type: "weekly" | "season";
    status: "completed" | "in_progress";
    summary: any;
    leaderboard: LeaderboardPlayer[];
    expiringAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Game extends AggregateRoot<GameProps> {
    get gameId(): GameId {
        return GameId.create(this._id).getValue();
    }

    get name() {
        return this.props.name;
    }
    get description() {
        return this.props.description;
    }
    get roomId(): RoomId {
        return this.props.roomId
    }
    get leagueId(): LeagueId {
        return this.props.leagueId;
    }
    get type() {
        return this.props.type;
    }
    get status() {
        return this.props.status;
    }
    get summary() {
        return this.props.summary;
    }
    get leaderboard() {
        return this.props.leaderboard;
    }
    get expiringAt(): Date {
        return this.props.expiringAt
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    private constructor(roleProps: GameProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static create(props: GameProps, id?: UniqueEntityID): Result<Game> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: "name" },
            { argument: props.roomId, argumentName: "roomId" },
            { argument: props.leagueId, argumentName: "leagueId" },
            { argument: props.type, argumentName: "type" },
            { argument: props.expiringAt, argumentName: "expiringAt" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Game>(guardResult.message || "");
        }

        const prediction = new Game(props, id);
        // const isNewPrediction = !id;

        // if (isNewPrediction) {
        //     prediction.addDomainEvent(new MatchPredictionCreated(prediction));
        // }
        return Result.ok<Game>(prediction);
    }
}
