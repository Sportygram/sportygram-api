import { CreateGameDTO } from "./createGameDTO";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { RoomGameRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Game } from "../../domain/game";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { RoomId } from "../../../messaging/domain/roomId";
import { CompetitionId } from "../../domain/competitionId";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Game>
>;

export class CreateGame implements UseCase<CreateGameDTO, Promise<Response>> {
    constructor(private gameRepo: RoomGameRepo) {}

    async execute(request: CreateGameDTO): Promise<Response> {
        const {
            name,
            description,
            roomId,
            competitionId,
            type,
            expiringAt,
        } = request;

        try {
            const gameOrError: Result<Game> = Game.create({
                name,
                description,
                roomId: RoomId.create(new UniqueEntityID(roomId)).getValue(),
                competitionId: CompetitionId.create(
                    new UniqueEntityID(competitionId)
                ).getValue(),
                type,
                expiringAt,
            });

            if (gameOrError.isFailure && gameOrError.error) {
                return left(new AppError.InputError(gameOrError.error));
            }

            const game = gameOrError.getValue();
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
