import { ScoreMatchPredictionsDTO } from "./scoreMatchPredictions.dto";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import {
    MatchPredictionRepo,
    MatchRepo,
    PlayerRepo,
} from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { MatchPrediction } from "../../domain/matchPrediction";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<any>
>;

export class ScoreMatchPredictions
    implements UseCase<ScoreMatchPredictionsDTO, Promise<Response>>
{
    constructor(
        private matchRepo: MatchRepo,
        private matchPredictionRepo: MatchPredictionRepo,
        private playerRepo: PlayerRepo
    ) {}

    async execute(request: ScoreMatchPredictionsDTO): Promise<Response> {
        const { matchId } = request;

        try {
            const match = await this.matchRepo.getMatchById(matchId);
            if (!match) {
                return left(new AppError.InputError(`Match not found`));
            }

            const matchPredictions =
                await this.matchPredictionRepo.getPredictionsByMatchId(matchId);

            const scoringResultsOrError: Result<MatchPrediction>[] =
                await Promise.all(
                    matchPredictions.map(async (prediction) => {
                        const { userId } = prediction;
                        const player = await this.playerRepo.getPlayerByUserId(
                            userId.id.toString()
                        );
                        if (!player) {
                            return Result.fail(
                                `Player with userId ${userId} not found`
                            );
                        }

                        const additionalPointsOrError =
                            prediction.scoreMatchPrediction(match);
                        if (additionalPointsOrError.isFailure) {
                            return Result.fail(
                                additionalPointsOrError.error as string
                            );
                        }
                        player.updateCompetitonGameScores(
                            match.competitionId,
                            additionalPointsOrError.getValue()
                        );
                        // TODO: commit both player and matchPrediction in a transaction
                        await this.playerRepo.save(player);
                        await this.matchPredictionRepo.save(prediction);
                        return Result.ok<MatchPrediction>(prediction);
                    })
                );

            if (match.allQuestionsAnswered()) match.setAllPredictionsScored();
            await this.matchRepo.save(match);

            const scoringResults = scoringResultsOrError.reduce<{
                successCount: number;
                failureCount: number;
                failed: string[];
            }>(
                (prevSummary, scoredOrError) => {
                    if (scoredOrError.isSuccess) {
                        return {
                            ...prevSummary,
                            successCount: prevSummary.successCount + 1,
                        };
                    } else {
                        const error = scoredOrError.error?.toString() || "";
                        return {
                            ...prevSummary,
                            failureCount: prevSummary.failureCount + 1,
                            failedPredictions: [
                                ...prevSummary.failed,
                                error,
                            ],
                        };
                    }
                },
                { successCount: 0, failureCount: 0, failed: [] }
            );

            return right(
                Result.ok({
                    matchId,
                    summary: {
                        totalPredictions: matchPredictions.length,
                        ...scoringResults,
                    },
                })
            );
        } catch (err) {
            return left(
                new AppError.UnexpectedError(
                    err,
                    this.constructor.name,
                    request
                )
            );
        }
    }
}
