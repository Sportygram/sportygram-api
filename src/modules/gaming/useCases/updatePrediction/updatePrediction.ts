import { UpdatePredictionDTO } from "./updatePredictionDTO";
import {
    MatchDoesNotExistError,
    PredictionDoesNotExistError,
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
        const { predictionId, requestUser } = request;

        try {
            // TODO Check if requestUser can update prediction
            const prediction = await this.matchPredictionRepo.getPredictionById(
                predictionId
            );
            if (!prediction) {
                return left(new PredictionDoesNotExistError(predictionId));
            }

            if (requestUser.userId !== prediction.userId.id.toString()) {
                return left(
                    new AppError.PermissionsError(
                        "UpdatePrediction",
                        requestUser?.userId
                    )
                );
            }
            
            const matchId = prediction.matchId.id.toString();
            const match = await this.matchRepo.getMatchById(matchId);
            if (!match) {
                return left(new MatchDoesNotExistError(matchId));
            }

            const playerPredictionOrError = PlayerPredictions.create(
                request.predictions,
                false,
                match.questions
            );

            if (
                playerPredictionOrError.isFailure &&
                playerPredictionOrError.error
            ) {
                return left(
                    new AppError.InputError(playerPredictionOrError.error)
                );
            }

            prediction.updatePredictions(playerPredictionOrError.getValue())
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
