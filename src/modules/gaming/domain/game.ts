import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { CompetitionId } from "./competitionId";
import { GameCompleted } from "./events/gameCompleted";
import { GameCreated } from "./events/gameCreated";
import { GameId } from "./gameId";
import { GameStatus, GameType } from "./types";

interface GameProps {
    name: string;
    description?: string;
    competitionId: CompetitionId;
    type: string;
    status?: string;
    metadata: any;
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
    get competitionId(): CompetitionId {
        return this.props.competitionId;
    }
    get type(): GameType {
        return this.props.type as GameType;
    }
    get status(): GameStatus {
        return this.props.status as GameStatus;
    }
    get metadata() {
        return this.props.metadata;
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

    public updateMetadata(data: any) {
        this.props.metadata = {
            ...this.props.metadata,
            ...data,
        };
    }

    public completeGame() {
        this.props.status = "completed";
        this.addDomainEvent(new GameCompleted(this));
    }

    private constructor(roleProps: GameProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static create(props: GameProps, id?: UniqueEntityID): Result<Game> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: "name" },
            { argument: props.competitionId, argumentName: "competitionId" },
            { argument: props.type, argumentName: "type" },
            { argument: props.expiringAt, argumentName: "expiringAt" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Game>(guardResult.message || "");
        }

        const type = props.type.toLowerCase() as GameType;
        const status = "in_progress";
        const gameTypeGuard = Guard.isValidValueOfObjectType<GameType>(
            type,
            GameType,
            "type"
        );

        if (!gameTypeGuard.succeeded) {
            return Result.fail<Game>("Invalid game type");
        }

        const game = new Game({ ...props, type, status }, id);
        const isNewGame = !id;

        if (isNewGame) {
            game.addDomainEvent(new GameCreated(game));
        }
        return Result.ok<Game>(game);
    }
}
