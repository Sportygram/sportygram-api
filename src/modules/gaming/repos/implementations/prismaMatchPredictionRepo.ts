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
