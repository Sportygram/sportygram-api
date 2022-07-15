import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class PredictionDoesNotExistError extends Result<UseCaseError> {
    constructor(predictionId: string) {
        super(false, {
            message: `No predictionId with the id; ${predictionId} was found`,
        } as UseCaseError);
    }
}

export class MatchDoesNotExistError extends Result<UseCaseError> {
    constructor(matchId: string) {
        super(false, {
            message: `Match with id; ${matchId} was not found`,
        } as UseCaseError);
    }
}

export class PredictionLockedError extends Result<UseCaseError> {
    constructor(_matchId: string) {
        super(false, {
            message: `Prediction locked, Please unlock first before updating`,
        } as UseCaseError);
    }
}
