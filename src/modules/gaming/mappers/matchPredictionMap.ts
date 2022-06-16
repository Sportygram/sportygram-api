import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { UserId } from "../../users/domain/userId";
import { MatchPrediction as PMatchPrediction } from "@prisma/client";
import { MatchPrediction } from "../domain/matchPrediction";
import { PlayerPredictions } from "../domain/valueObjects/playerPredictions";

export type RawMatchPrediction = PMatchPrediction
export class MatchPredictionMap {
    public static toDomain(raw: RawMatchPrediction): MatchPrediction {
        const userId = UserId.create(new UniqueEntityID(raw.userId)).getValue();
        const matchId = UserId.create(
            new UniqueEntityID(raw.matchId)
        ).getValue();

        const predictions = PlayerPredictions.create(
            raw.predictions as any,
            true
        ).getValue();

        const predictionOrError = MatchPrediction.create(
            {
                userId,
                matchId,
                points: raw.points,
                predictions,
                createdAt: raw.createdAt || undefined,
                updatedAt: raw.updatedAt || undefined,
            },
            new UniqueEntityID(raw.id)
        );

        if (!predictionOrError.isSuccess) {
            throw new Error(predictionOrError.error as string);
        }
        return predictionOrError.getValue();
    }

    public static toPersistence(
        prediction: MatchPrediction
    ): RawMatchPrediction {
        return {
            id: prediction.predictionId.id.toString(),
            userId: prediction.userId.id.toString(),
            matchId: prediction.matchId.id.toString(),
            points: prediction.points,
            predictions: prediction.predictions.value as any,
            createdAt: prediction.createdAt,
            updatedAt: prediction.updatedAt,
        };
    }
}
