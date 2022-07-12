import { UserGameSummary } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { CompetitionId } from "../domain/competitionId";
import { GameId } from "../domain/gameId";
import { PlayerGameSummary } from "../domain/gameSummary";
import { PlayerId } from "../domain/playerId";

export class GameSummaryMap {
    public static toDomain(raw: UserGameSummary): PlayerGameSummary {
        const playerId = PlayerId.create(
            new UniqueEntityID(raw.playerId)
        ).getValue();
        const competitionId = CompetitionId.create(
            new UniqueEntityID(raw.competitionId)
        ).getValue();
        const gameId = GameId.create(new UniqueEntityID(raw.gameId)).getValue();

        const gameSummaryOrError = PlayerGameSummary.create(
            {
                playerId,
                competitionId,
                gameId,
                type: raw.type,
                status: raw.status,
                score: raw.score,
                summary: raw.summary,
                createdAt: raw.createdAt || undefined,
                updatedAt: raw.updatedAt || undefined,
            },
            new UniqueEntityID(raw.id)
        );
        if (!gameSummaryOrError.isSuccess)
            throw new Error("" + gameSummaryOrError.error);

        return gameSummaryOrError.getValue();
    }

    public static toPersistence(
        gameSummary: PlayerGameSummary
    ): UserGameSummary {
        return {
            id: gameSummary.id.toString(),
            playerId: gameSummary.playerId.id.toString(),
            competitionId: Number(gameSummary.competitionId.id.toString()),
            type: gameSummary.type,
            status: gameSummary.status,
            gameId: gameSummary.gameId.id.toString(),
            score: gameSummary.score,
            summary: gameSummary.summary,
            createdAt: gameSummary.createdAt,
            updatedAt: gameSummary.updatedAt,
        };
    }
}
