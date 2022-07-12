import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { GameRepo, PlayerRepo, RoomGameRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Game } from "../../domain/game";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Game>
>;

export class EndGames implements UseCase<{}, Promise<Response>> {
    constructor(
        private gameRepo: GameRepo,
        private roomGameRepo: RoomGameRepo,
        private playerRepo: PlayerRepo
    ) {}
/*
- Get all ended games that have ended but still in_progress
- Get all room games for the ended games
- Calculate summary for each room game
- Save room games with summary to db and status completed (
    room game must only be completed once so the summary message goes out once
    even if the end game calls for a game again)
- Get all user game summaries
- Calculate summary for each user game
- Save user games with summary to db and status completed
- Update game status to completed
- Save game to db;
- Trigger game ended
*/
    async execute(request: {}): Promise<Response> {
        try {
            const endedGames = await this.gameRepo.getEndedGames();

            await Promise.all(
                endedGames.map(async (game) => {
                    try {
                        let gameEndResult = {
                            gameId: game.id,
                            completeRoomGameResults:
                                await this.completeRoomGames(game),
                            completePlayerGameSummaries:
                                await this.completePlayerGameSummaries(game),
                        };

                        game.completeGame();
                        await this.gameRepo.save(game);

                        return gameEndResult;
                    } catch (error) {
                        return Result.fail(error);
                    }
                })
            );

            return right(Result.ok());
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

    private async completeRoomGames(game: Game) {
        try {
            const roomGames = await this.roomGameRepo.getRoomGamesByGameId(
                game.gameId.id.toString()
            );

            const roomGameUpdates = await Promise.all(
                roomGames.map(async (roomGame) => {
                    const roomGameCompleteOrError = roomGame.completeRoomGame();
                    if (roomGameCompleteOrError.isFailure) {
                        return roomGameCompleteOrError;
                    }
                    await this.roomGameRepo.save(roomGame);
                    return roomGameCompleteOrError;
                })
            );
            return {
                roomGameUpdateStatus: "success",
                roomGameUpdates,
            };
        } catch (error) {
            return { roomGameUpdateStatus: "failed" };
        }
    }

    private async completePlayerGameSummaries(game: Game) {
        try {
            const players = await this.playerRepo.getAllPlayers(
                game.gameId.id.toString()
            );
            const completeGameUpdates = await Promise.all(
                players.map(async (player) => {
                    const completeGameSummaryOrError =
                        player.setGameSummaryComplete(game.gameId);
                    if (completeGameSummaryOrError.isFailure) {
                        return completeGameSummaryOrError;
                    }
                    await this.playerRepo.save(player);
                    return completeGameSummaryOrError;
                })
            );

            return {
                completeGameUpdateStatus: "success",
                completeGameUpdates,
            };
        } catch (error) {
            return {
                completeGameUpdateStatus: "failed",
            };
        }
    }
}
