import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `No user with the userId; ${userId} was found`,
        } as UseCaseError);
    }
}

export class UserProfileDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `User with userId; ${userId} was not found`,
        } as UseCaseError);
    }
}
