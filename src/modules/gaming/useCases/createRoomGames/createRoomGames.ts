import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { GameRepo, RoomGameRepo } from "../../repos/interfaces";
import { CreateRoomGamesDTO } from "./createRoomGames.dto";
import { UserProfileDoesNotExistError } from "../../../messaging/useCases/createChatUser/createChatUserErrors";
import { RoomRepo } from "../../../messaging/repos/interfaces";
import { RoomGame } from "../../domain/roomGame";

type Response = Either<
    | UserProfileDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<void>
>;

export class CreateRoomGames
    implements UseCase<CreateRoomGamesDTO, Promise<Response>>
{
    constructor(
        private roomGameRepo: RoomGameRepo,
        private gameRepo: GameRepo,
        private roomRepo: RoomRepo
    ) {}

    async execute(request: CreateRoomGamesDTO): Promise<Response> {
        const { roomId } = request;

        try {
            const room = await this.roomRepo.getRoomById(roomId);

            if (!room) {
                return left(new UserProfileDoesNotExistError(roomId));
            }
            const roomPlayers = (await this.roomRepo.getRoomIdsWithPlayers())[0]
                .players;
            const activeGames = await this.gameRepo.getActiveGames();
            const roomGamesOrErrors: Result<void>[] = await Promise.all(
                activeGames.map(async (game) => {
                    const roomGameOrError = RoomGame.create({
                        gameId: game.gameId,
                        roomId: room.roomId,
                        competitionId: game.competitionId,
                        type: game.type,
                        status: game.status,
                        leaderboard: roomPlayers.map((p) => ({
                            playerId: p.playerId,
                            username: p.username,
                            score: 0,
                            rank: 0,
                            prevRank: 0,
                        })),
                    });

                    if (roomGameOrError.isFailure) {
                        return Result.fail(roomGameOrError.error + "");
                    }

                    const roomGame = roomGameOrError.getValue();
                    await this.roomGameRepo.save(roomGame);
                    return Result.ok();
                })
            );

            const addedActiveRoomGamesOrError =
                Result.combine(roomGamesOrErrors);
            if (addedActiveRoomGamesOrError.isFailure) {
                throw new Error(addedActiveRoomGamesOrError.error);
            }

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
