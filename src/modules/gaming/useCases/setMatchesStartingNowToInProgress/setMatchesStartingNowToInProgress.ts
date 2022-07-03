import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { MatchRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { AsyncRedisClient } from "../../../../infra/redis/abstractRedisClient";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<void>
>;

export class SetMatchesStartingNowToInProgress
    implements UseCase<{}, Promise<Response>>
{
    constructor(
        private matchRepo: MatchRepo,
        private redisClient: AsyncRedisClient
    ) {}

    async execute(request: {}): Promise<Response> {
        try {
            const setKey = "matches_set";

            const next24hoursList = await this.redisClient.getSortedSetRange(
                setKey
            );

            if (next24hoursList.length === 0) {
                let upcomingMatches = await this.matchRepo.getUpcomingMatches();

                if (upcomingMatches.length === 0)
                    upcomingMatches = await this.matchRepo.getUpcomingMatches({
                        nextMatch: true,
                    });

                if (upcomingMatches.length === 0) {
                    throw new Error("No upcoming matches on database");
                }

                await this.redisClient.addToSortedSet(
                    setKey,
                    upcomingMatches.map((m) => ({
                        value: m.id,
                        score: Number(m.dateTime),
                    }))
                );
            }

            next24hoursList.forEach(async (m) => {
                if (m. score < Date.now() - 30 * 1000) {
                    const match = await this.matchRepo.getMatchById(m.value);
                    if (!match) {
                        this.redisClient.removeFromSortedSet(setKey, [m.value]);
                        throw new Error(`Match ${m.value} not found`);
                    }

                    match.updateMatchStatus("in_progress");
                    await this.matchRepo.save(match);
                    this.redisClient.removeFromSortedSet(setKey, [m.value]);
                }
            });

            return right(Result.ok<void>());
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
