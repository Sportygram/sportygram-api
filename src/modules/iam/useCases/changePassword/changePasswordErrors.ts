import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `The user with id; ${userId} does not exist`,
        } as UseCaseError);
    }
}

export class PasswordDoesntMatchError extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `Password is incorrect`,
        } as UseCaseError);
    }
}
