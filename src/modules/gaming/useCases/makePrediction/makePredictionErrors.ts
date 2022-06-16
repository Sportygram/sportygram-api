import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `No user with the userId; ${userId} was found`,
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
