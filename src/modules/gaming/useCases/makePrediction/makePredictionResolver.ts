import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { MakePredictionDTO } from "./makePredictionDTO";
import { matchPredictionReadRepo } from "../../repos";
import { makePrediction } from ".";
import {
    UserDoesNotExistError,
    MatchDoesNotExistError,
    PredictionClosedError,
} from "./makePredictionErrors";

export const makePredictionResolver: FieldResolver<
    "Mutation",
    "predictMatch"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args.input,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as MakePredictionDTO;

    const result = await makePrediction.execute(dto);

    if (result.isRight()) {
        const predictionId = result.value.getValue().id.toString();
        const prediction = await matchPredictionReadRepo.getMatchPredictionById(
            predictionId
        );
        if (!prediction) throw new Error("Prediction fetch Error");

        return {
            message: "Match Prediction Saved",
            prediction,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case UserDoesNotExistError:
            case MatchDoesNotExistError:
            case PredictionClosedError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
