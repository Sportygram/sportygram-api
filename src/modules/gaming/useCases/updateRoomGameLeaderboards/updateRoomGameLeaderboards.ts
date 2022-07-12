import { UpdateRoomGameLeaderboardsDTO } from "./updateRoomGameLeaderboards.dto";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { RoomGameRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Summary } from "../../../../lib/@types";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Summary>
>;

export class UpdateRoomGameLeaderboards
    implements UseCase<UpdateRoomGameLeaderboardsDTO, Promise<Response>>
{
    constructor(private roomGameRepo: RoomGameRepo) {}

    async execute(request: UpdateRoomGameLeaderboardsDTO): Promise<Response> {
        const { competitionId } = request;

        try {
            const liveGames = await this.roomGameRepo.getLiveRoomGames(
                Number(competitionId)
            );

            const liveGameUpdateResults = await Promise.all(
                liveGames.map(async (game) => {
                    try {
                        const players = await this.roomGameRepo.getRoomPlayers(
                            game.roomId.id.toString(),
                            game.id.toString()
                        );

                        const newScores = players.map((player) => {
                            const summary = player.activeGameSummaries
                                .getItems()
                                .find((gs) =>
                                    gs.gameId.equals(game.roomGameId)
                                );
                            if (!summary) {
                                // player does not have game summary for game for some reason
                                return {
                                    playerId: player.id.toString(),
                                    username: player.username,
                                    score: 0,
                                };
                            }
                            return {
                                playerId: player.id.toString(),
                                username: player.username,
                                score: summary.score,
                            };
                        });

                        // Calculate new leaderboard

                        // join game leaderboard with new player scores
                        const newLeaderboardWithoutRank = newScores.map(
                            (score) => {
                                const oldLeaderboardPlayer =
                                    game.leaderboard.find(
                                        (p) => p.playerId === score.playerId
                                    );

                                if (!oldLeaderboardPlayer) {
                                    // player was not added to lb after player joined room
                                    // can either fetch player and add to leaderboard
                                    // or just log and trace bug that caused this

                                    return { ...score, prevRank: 0 };
                                }
                                return {
                                    ...oldLeaderboardPlayer,
                                    prevRank: oldLeaderboardPlayer.rank,
                                    score: score.score,
                                };
                            }
                        );

                        newLeaderboardWithoutRank.sort(
                            (a, b) => b.score - a.score
                        );
                        const newLeaderboard = newLeaderboardWithoutRank.map(
                            (player, index) => {
                                return { ...player, rank: index + 1 };
                            }
                        );

                        game.updateLeaderboard(newLeaderboard);
                        await this.roomGameRepo.save(game);
                        return Result.ok<void>();
                    } catch (err) {
                        return Result.fail<void>(err);
                    }
                })
            );

            const results = liveGameUpdateResults.reduce<{
                successCount: number;
                failureCount: number;
                failed: string[];
            }>(
                (prevSummary, liveGameUpdateResult) => {
                    if (liveGameUpdateResult.isSuccess) {
                        return {
                            ...prevSummary,
                            successCount: prevSummary.successCount + 1,
                        };
                    } else {
                        const error =
                            liveGameUpdateResult.error?.toString() || "";
                        return {
                            ...prevSummary,
                            failureCount: prevSummary.failureCount + 1,
                            failed: [...prevSummary.failed, error],
                        };
                    }
                },
                { successCount: 0, failureCount: 0, failed: [] }
            );

            const summary = {
                ...results,
                total: liveGameUpdateResults.length,
            };
            return right(Result.ok(summary));
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
