import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { MatchRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Match } from "../../domain/match";
import { ApiFootballService } from "../../services/footballService/apiFootballService";
import logger from "../../../../lib/core/Logger";

interface Summary {}

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Summary>
>;

export class UpdateApiFootballLiveMatches
    implements UseCase<{}, Promise<Response>>
{
    constructor(
        private matchRepo: MatchRepo,
        private apiFootballService: ApiFootballService
    ) {}

    async execute(request: {}): Promise<Response> {
        try {
            const liveMatches = await this.matchRepo.getLiveMatches();
            const updateMatchesOrError = await Promise.all(
                liveMatches.map(async (match) => {
                    try {
                        const matchDto =
                            await this.apiFootballService.getLiveMatch(match);
                        const { periods, winner, summary, status, metadata } =
                            matchDto;

                        const updatedOrError = match.updateLiveMatch({
                            periods,
                            winner,
                            summary,
                            status,
                            metadata,
                        });

                        if (updatedOrError.isFailure && updatedOrError.error) {
                            throw new Error(updatedOrError.error);
                        }
                        // save to db
                        await this.matchRepo.save(match);
                        return Result.ok<Match>(match);
                    } catch (error) {
                        logger.error(" Error updating live match", error);
                        return Result.fail<Match>(
                            `Match with id ${match.id.toValue()} update failed: ${
                                error.message
                            }`
                        );
                    }
                })
            );

            // generate summary
            // log any errors and notify admin

            const summary = updateMatchesOrError.reduce<{
                successCount: number;
                failureCount: number;
                failedMatches: string[];
            }>(
                (prevSummary, matchOrError) => {
                    if (matchOrError.isSuccess) {
                        return {
                            ...prevSummary,
                            successCount: prevSummary.successCount + 1,
                        };
                    } else {
                        const error = matchOrError.error?.toString() || "";
                        return {
                            ...prevSummary,
                            failureCount: prevSummary.failureCount + 1,
                            failedMatches: [
                                ...prevSummary.failedMatches,
                                error,
                            ],
                        };
                    }
                },
                { successCount: 0, failureCount: 0, failedMatches: [] }
            );

            return right(Result.ok<Summary>(summary));
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
