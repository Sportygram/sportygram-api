import { UpdatePredictionDTO } from "./updatePredictionDTO";
import {
    MatchDoesNotExistError,
    PredictionDoesNotExistError,
    PredictionLockedError,
} from "./updatePredictionErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { MatchPredictionRepo, MatchRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { MatchPrediction } from "../../domain/matchPrediction";
import { PlayerPredictions } from "../../domain/valueObjects/playerPredictions";

type Response = Either<
    | MatchDoesNotExistError
    | PredictionDoesNotExistError
    | PredictionLockedError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<MatchPrediction>
>;

export class UpdatePrediction
    implements UseCase<UpdatePredictionDTO, Promise<Response>>
{
    constructor(
        private matchPredictionRepo: MatchPredictionRepo,
        private matchRepo: MatchRepo
    ) {}

    async execute(request: UpdatePredictionDTO): Promise<Response> {
        const { matchId, requestUser } = request;

        try {
            // TODO Check if requestUser can update prediction; with Coins
            const prediction =
                await this.matchPredictionRepo.getPredictionByMatchId(
                    matchId,
                    requestUser.userId
                );
            if (!prediction) {
                return left(new PredictionDoesNotExistError(matchId));
            }
            if (process.env.NODE_ENV === "production") {
                if (!prediction.unlocked) {
                    return left(new PredictionLockedError(matchId));
                }
            }

            if (requestUser.userId !== prediction.userId.id.toString()) {
                return left(
                    new AppError.PermissionsError(
                        "UpdatePrediction",
                        requestUser?.userId
                    )
                );
            }

            const match = await this.matchRepo.getMatchById(matchId);
            if (!match) {
                return left(new MatchDoesNotExistError(matchId));
            }

            const playerPredictionOrError = PlayerPredictions.create(
                request.predictions,
                true,
                match
            );

            if (
                playerPredictionOrError.isFailure &&
                playerPredictionOrError.error
            ) {
                return left(
                    new AppError.InputError(playerPredictionOrError.error)
                );
            }

            prediction.updatePredictions(playerPredictionOrError.getValue());
            await this.matchPredictionRepo.save(prediction);

            return right(Result.ok<MatchPrediction>(prediction));
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
