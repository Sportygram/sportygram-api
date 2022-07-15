import { MakePredictionDTO } from "./makePredictionDTO";
import {
    MatchDoesNotExistError,
    PredictionClosedError,
    UserDoesNotExistError,
} from "./makePredictionErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import {
    MatchPredictionRepo,
    MatchRepo,
    PlayerRepo,
} from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { MatchPrediction } from "../../domain/matchPrediction";
import { PlayerPredictions } from "../../domain/valueObjects/playerPredictions";
import { MatchStatus } from "../../domain/types";
import { get } from "lodash";

type Response = Either<
    | PredictionClosedError
    | MatchDoesNotExistError
    | UserDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<MatchPrediction>
>;

export class MakePrediction
    implements UseCase<MakePredictionDTO, Promise<Response>>
{
    constructor(
        private matchPredictionRepo: MatchPredictionRepo,
        private matchRepo: MatchRepo,
        private playerRepo: PlayerRepo
    ) {}

    async execute(request: MakePredictionDTO): Promise<Response> {
        const { matchId, userId } = request;

        try {
            const match = await this.matchRepo.getMatchById(matchId);
            if (!match) {
                return left(new MatchDoesNotExistError(matchId));
            }

            const alreadyComplete = (
                [
                    MatchStatus.Break,
                    MatchStatus.Suspended,
                    MatchStatus.Cancelled,
                    MatchStatus.Completed,
                ] as string[]
            ).includes(match.status);

            const pastHalfTime = get(match, "metadata.status.elapsed", 0) > 45;

            if (alreadyComplete || pastHalfTime) {
                return left(new PredictionClosedError(matchId));
            }

            const player = await this.playerRepo.getPlayerByUserId(userId);
            if (!player) {
                return left(new UserDoesNotExistError(matchId));
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

            const predictionOrError: Result<MatchPrediction> =
                MatchPrediction.create({
                    userId: player.userId,
                    matchId: match.matchId,
                    unlocked: false,
                    predictions: playerPredictionOrError.getValue(),
                });

            if (predictionOrError.isFailure && predictionOrError.error) {
                return left(new AppError.InputError(predictionOrError.error));
            }

            const prediction = predictionOrError.getValue();
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
