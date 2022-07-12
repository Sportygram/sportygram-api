import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { GameRepo, PlayerRepo } from "../../repos/interfaces";
import { CreatePlayerDTO } from "./createPlayer.dto";
import { Player } from "../../domain/player";
import { UserProfileDoesNotExistError } from "../../../messaging/useCases/createChatUser/createChatUserErrors";
import { PlayerGameSummary } from "../../domain/gameSummary";

type Response = Either<
    | UserProfileDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<Player>
>;

export class CreatePlayer
    implements UseCase<CreatePlayerDTO, Promise<Response>>
{
    constructor(private playerRepo: PlayerRepo, private gameRepo: GameRepo) {}

    async execute(request: CreatePlayerDTO): Promise<Response> {
        const { userId } = request;

        try {
            const player = await this.playerRepo.getPlayerByUserId(userId);

            if (!player) {
                return left(new UserProfileDoesNotExistError(userId));
            }

            const activeGames = await this.gameRepo.getActiveGames();
            const playerGameSummaries: Result<void>[] = activeGames.map(
                (game) => {
                    const playerGameSummaryOrError = PlayerGameSummary.create({
                        gameId: game.gameId,
                        playerId: player.playerId,
                        competitionId: game.competitionId,
                        type: game.type,
                        status: game.status,
                    });

                    if (playerGameSummaryOrError.isFailure) {
                        return Result.fail(playerGameSummaryOrError.error + "");
                    }

                    const playerGameSummary =
                        playerGameSummaryOrError.getValue();
                    return player.addActiveGameSummary(playerGameSummary);
                }
            );

            const addedActiveGamesOrError = Result.combine(playerGameSummaries);
            if (addedActiveGamesOrError.isFailure) {
                throw new Error(addedActiveGamesOrError.error);
            }
            await this.playerRepo.save(player);

            return right(Result.ok<Player>(player));
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
