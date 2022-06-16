import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { UpdatePredictionDTO } from "./updatePredictionDTO";
import { matchPredictionReadRepo } from "../../repos";
import { updatePrediction } from ".";
import {
    PredictionDoesNotExistError,
    MatchDoesNotExistError,
} from "./updatePredictionErrors";

export const updatePredictionResolver: FieldResolver<
    "Mutation",
    "updatePrediction"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args.input,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as UpdatePredictionDTO;

    const result = await updatePrediction.execute(dto);

    if (result.isRight()) {
        const predictionId = result.value.getValue().id.toString();
        const prediction = await matchPredictionReadRepo.getMatchPredictionById(
            predictionId
        );
        if (!prediction) throw new Error("Prediction fetch Error");

        return {
            message: "Match Prediction Updated",
            prediction,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case PredictionDoesNotExistError:
            case MatchDoesNotExistError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
