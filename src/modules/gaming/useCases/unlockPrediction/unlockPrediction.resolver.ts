import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { UnlockPredictionDTO } from "./unlockPrediction.dto";
import { matchPredictionReadRepo } from "../../repos";
import { unlockPrediction } from ".";
import {
    PredictionAlreadyUnlockedError,
    PredictionDoesNotExistError,
    PlayerDoesNotExistError,
    InsufficientCoinBalanceError,
} from "./unlockPrediction.errors";

export const unlockPredictionResolver: FieldResolver<
    "Mutation",
    "unlockPrediction"
> = async (_parent, args, ctx) => {
    const dto = {
        predictionId: args.predictionId,
        requestUser: ctx.reqUser,
    } as UnlockPredictionDTO;

    const result = await unlockPrediction.execute(dto);

    if (result.isRight()) {
        const predictionId = result.value.getValue().id.toString();
        const prediction = await matchPredictionReadRepo.getMatchPredictionById(
            predictionId
        );
        if (!prediction) throw new Error("Prediction fetch Error");

        return {
            message: "Match Prediction Unlocked",
            prediction,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case PredictionAlreadyUnlockedError:
            case PredictionDoesNotExistError:
            case PlayerDoesNotExistError:
            case InsufficientCoinBalanceError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
