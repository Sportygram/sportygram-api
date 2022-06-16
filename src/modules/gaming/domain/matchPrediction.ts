import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { UserId } from "../../users/domain/userId";
import { MatchId } from "./matchId";
import { PredictionId } from "./predictionId";
import { PlayerPredictions } from "./valueObjects/playerPredictions";

interface MatchPredictionProps {
    userId: UserId;
    matchId: MatchId;
    points?: number;
    predictions: PlayerPredictions;
    createdAt?: Date;
    updatedAt?: Date;
}

export class MatchPrediction extends AggregateRoot<MatchPredictionProps> {
    get predictionId(): PredictionId {
        return PredictionId.create(this._id).getValue();
    }

    get userId(): UserId {
        return this.props.userId;
    }
    get matchId(): MatchId {
        return this.props.matchId;
    }
    get points(): number {
        return this.props.points || 0;
    }
    get predictions(): PlayerPredictions {
        return this.props.predictions;
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    public updatePredictions(predictions: PlayerPredictions): Result<void> {
        this.props.predictions = predictions;
        return Result.ok();
    }

    private constructor(roleProps: MatchPredictionProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static create(
        props: MatchPredictionProps,
        id?: UniqueEntityID
    ): Result<MatchPrediction> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.userId, argumentName: "playerId" },
            { argument: props.matchId, argumentName: "matchId" },
            { argument: props.predictions, argumentName: "predictions" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<MatchPrediction>(guardResult.message || "");
        }

        const prediction = new MatchPrediction(props, id);
        // const isNewPrediction = !id;

        // if (isNewPrediction) {
        //     prediction.addDomainEvent(new MatchPredictionCreated(prediction));
        // }
        return Result.ok<MatchPrediction>(prediction);
    }
}
