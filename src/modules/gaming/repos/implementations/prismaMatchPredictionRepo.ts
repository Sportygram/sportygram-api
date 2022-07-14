import { Prisma } from "@prisma/client";
import { prisma } from "../../../../infra/database/prisma/client";
import { MatchPrediction } from "../../domain/matchPrediction";
import { MatchPredictionMap } from "../../mappers/matchPredictionMap";
import { MatchPredictionRepo } from "../interfaces";

export class PrismaMatchPredictionRepo implements MatchPredictionRepo {
    async getPredictionById(
        predictionId: string
    ): Promise<MatchPrediction | undefined> {
        if (!predictionId) return undefined;
        const predictionEntity = await prisma.matchPrediction.findUnique({
            where: { id: predictionId },
        });
        if (!predictionEntity) return undefined;

        return MatchPredictionMap.toDomain(predictionEntity);
    }
    
    async getPredictionByMatchId(
        matchId: string,
        userId: string
    ): Promise<MatchPrediction | undefined> {
        if (!matchId) return undefined;
        const predictionEntity = await prisma.matchPrediction.findMany({
            where: { matchId, userId },
        });
        if (!predictionEntity.length) return undefined;

        return MatchPredictionMap.toDomain(predictionEntity[0]);
    }

    async getPredictionsByMatchId(matchId: string): Promise<MatchPrediction[]> {
        if (!matchId) throw new Error("matchId is required");
        const predictionEntities = await prisma.matchPrediction.findMany({
            where: { matchId },
        });

        return predictionEntities.map(MatchPredictionMap.toDomain);
    }

    async save(prediction: MatchPrediction): Promise<void> {
        const rawPrediction = MatchPredictionMap.toPersistence(prediction);
        const pPrediction = {
            ...rawPrediction,
            predictions: rawPrediction.predictions as Prisma.JsonObject,
        };

        await prisma.matchPrediction.upsert({
            where: { id: rawPrediction.id },
            update: pPrediction,
            create: pPrediction,
        });
    }
}
