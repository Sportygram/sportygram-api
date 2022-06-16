import { prisma } from "../../../../infra/database/prisma/client";
import { PlayerPrediction } from "../../domain/types";
import { MatchPredictionReadRepo, QueryMatchPrediction } from "../interfaces";

export class PrismaMatchPredictionReadRepoRepo
    implements MatchPredictionReadRepo
{
    async getMatchPredictionById(
        predictionId: string
    ): Promise<QueryMatchPrediction | undefined> {
        if (!predictionId) return undefined;
        const prediction = await prisma.matchPrediction.findUnique({
            where: { id: predictionId },
        });
        if (!prediction) return undefined;

        return {
            ...prediction,
            matchId: prediction.matchId,
            predictions: prediction.predictions as any as PlayerPrediction[],
        };
    }

    // async getUserPredictions(userId: string, date: string | Date) {
    //     if (!userId) return undefined;
    //     const predictions = await prisma.matchPrediction.findMany({
    //         where: { id: userId },
    //     });
    //     if (!prediction) return undefined;

    //     return {
    //         ...prediction,
    //         matchId: prediction.matchId,
    //         predictions: prediction.predictions as any as PlayerPrediction[],
    //     };
    // }
}
