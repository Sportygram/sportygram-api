import { CreateGameDTO } from "./createGameDTO";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { GameRepo, PlayerRepo, RoomGameRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Game } from "../../domain/game";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { CompetitionId } from "../../domain/competitionId";
import { RoomRepo } from "../../../messaging/repos/interfaces";
import { RoomGame } from "../../domain/roomGame";
import { RoomId } from "../../../messaging/domain/roomId";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Game>
>;

export class CreateGame implements UseCase<CreateGameDTO, Promise<Response>> {
    constructor(
        private gameRepo: GameRepo,
        private roomRepo: RoomRepo,
        private roomGameRepo: RoomGameRepo,
        private playerRepo: PlayerRepo
    ) {}

    async execute(request: CreateGameDTO): Promise<Response> {
        const { name, description, competitionId, type, expiringAt } = request;

        try {
            const gameOrError: Result<Game> = Game.create({
                name,
                description,
                competitionId: CompetitionId.create(
                    new UniqueEntityID(competitionId)
                ).getValue(),
                type,
                metadata: {},
                expiringAt: new Date(expiringAt),
            });

            if (gameOrError.isFailure && gameOrError.error) {
                return left(new AppError.InputError(gameOrError.error));
            }

            const game = gameOrError.getValue();
            await this.gameRepo.save(game);

            // Create new user game summaries for all users
            const userGameCount =
                await this.playerRepo.createAllUserGameSummaries(game);

            // Create new room game for all rooms
            const rooms = await this.roomRepo.getRoomIdsWithPlayers();
            const roomGamesOrErrors: Result<void>[] = await Promise.all(
                rooms.map(async (room) => {
                    const roomGameOrError = RoomGame.create({
                        gameId: game.gameId,
                        roomId: RoomId.create(
                            new UniqueEntityID(room.roomId)
                        ).getValue(),
                        competitionId: game.competitionId,
                        type: game.type,
                        status: game.status,
                        leaderboard: room.players.map((p) => ({
                            playerId: p.playerId,
                            username: p.username,
                            score: 0,
                            rank: 0,
                            prevRank: 0,
                        })),
                    });
                    if (roomGameOrError.isFailure && roomGameOrError.error) {
                        return Result.fail(
                            `${room.roomId}: ${roomGameOrError.error}`
                        );
                    }
                    await this.roomGameRepo.save(roomGameOrError.getValue());
                    return Result.ok();
                })
            );

            // Merge the results and save game metadata for results
            const roomGameResults = roomGamesOrErrors.reduce<{
                successCount: number;
                failureCount: number;
                failed: string[];
            }>(
                (prevSummary, roomGameCreatedOrError) => {
                    if (roomGameCreatedOrError.isSuccess) {
                        return {
                            ...prevSummary,
                            successCount: prevSummary.successCount + 1,
                        };
                    } else {
                        const error =
                            roomGameCreatedOrError.error?.toString() || "";
                        return {
                            ...prevSummary,
                            failureCount: prevSummary.failureCount + 1,
                            failed: [...prevSummary.failed, error],
                        };
                    }
                },
                { successCount: 0, failureCount: 0, failed: [] }
            );
            game.updateMetadata({
                userGameCount,
                roomGameCreationSummary: {
                    ...roomGameResults,
                    total: rooms.length,
                },
            });

            await this.gameRepo.save(game);
            return right(Result.ok<Game>(game));
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
