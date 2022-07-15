import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class PredictionDoesNotExistError extends Result<UseCaseError> {
    constructor(predictionId: string) {
        super(false, {
            message: `No predictionId with the id; ${predictionId} was found`,
        } as UseCaseError);
    }
}

export class PlayerDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `No player with the id; ${userId} was found`,
        } as UseCaseError);
    }
}

export class PredictionAlreadyUnlockedError extends Result<UseCaseError> {
    constructor(_predictionId: string) {
        super(false, {
            message: `Prediction already unlocked`,
        } as UseCaseError);
    }
}

export class InsufficientCoinBalanceError extends Result<UseCaseError> {
    constructor(_message: string, _userId: string) {
        super(false, {
            message: `You do not have sufficient coin balance; Please refer users or buy coins to unlock.`,
        } as UseCaseError);
    }
}
