import { UnlockPredictionDTO } from "./unlockPrediction.dto";
import {
    InsufficientCoinBalanceError,
    PlayerDoesNotExistError,
    PredictionAlreadyUnlockedError,
    PredictionDoesNotExistError,
} from "./unlockPrediction.errors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { MatchPredictionRepo, PlayerRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { MatchPrediction } from "../../domain/matchPrediction";

type Response = Either<
    | PredictionAlreadyUnlockedError
    | PredictionDoesNotExistError
    | PlayerDoesNotExistError
    | InsufficientCoinBalanceError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<MatchPrediction>
>;

export class UnlockPrediction
    implements UseCase<UnlockPredictionDTO, Promise<Response>>
{
    constructor(
        private matchPredictionRepo: MatchPredictionRepo,
        private playerRepo: PlayerRepo
    ) {}

    async execute(request: UnlockPredictionDTO): Promise<Response> {
        const { predictionId, requestUser } = request;

        try {
            const prediction = await this.matchPredictionRepo.getPredictionById(
                predictionId
            );
            if (!prediction) {
                return left(new PredictionDoesNotExistError(predictionId));
            }
            if (prediction.unlocked) {
                return left(new PredictionAlreadyUnlockedError(predictionId));
            }

            if (requestUser.userId !== prediction.userId.id.toString()) {
                return left(
                    new AppError.PermissionsError(
                        "UnlockPrediction",
                        requestUser?.userId
                    )
                );
            }

            const userId = prediction.userId.id.toString();
            const player = await this.playerRepo.getPlayerByUserId(userId);
            if (!player) {
                return left(new PlayerDoesNotExistError(userId));
            }

            const debitOrError = player.debitCoinBalanceForPredictionEdit();
            if (debitOrError.isFailure && debitOrError.error) {
                return left(
                    new InsufficientCoinBalanceError(debitOrError.error, userId)
                );
            }

            prediction.unlock();
            await this.playerRepo.save(player);
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
