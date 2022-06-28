import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { RoomId } from "../../messaging/domain/roomId";
import { CompetitionId } from "./competitionId";
import { GameId } from "./gameId";
import { LeaderboardPlayer } from "./types";

const GameType = ["weekly", "season"] as const;
type GameType = typeof GameType[number];

const GameStatus = ["completed", "in_progress"] as const;
type GameStatus = typeof GameStatus[number];

interface GameProps {
    name: string;
    description?: string;
    roomId: RoomId;
    competitionId: CompetitionId;
    type: string;
    status?: string;
    summary?: any;
    leaderboard?: LeaderboardPlayer[];
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
        return this.props.summary;
    }
    get leaderboard() {
        return this.props.leaderboard;
    }
    get expiringAt(): Date {
        return this.props.expiringAt;
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
            { argument: props.competitionId, argumentName: "competitionId" },
            { argument: props.type, argumentName: "type" },
            { argument: props.expiringAt, argumentName: "expiringAt" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Game>(guardResult.message || "");
        }

        const type = props.type.toLowerCase() as GameType;
        const status = "in_progress";
        const gameTypeGuard = Guard.isValidValueOfType<GameType>(
            type,
            GameType,
            "type"
        );

        if (!gameTypeGuard.succeeded) {
            return Result.fail<Game>("Invalid game type");
        }

        const game = new Game({ ...props, type, status }, id);
        // const isNewPrediction = !id;

        // if (isNewPrediction) {
        //     prediction.addDomainEvent(new MatchPredictionCreated(prediction));
        // }
        return Result.ok<Game>(game);
    }
}
