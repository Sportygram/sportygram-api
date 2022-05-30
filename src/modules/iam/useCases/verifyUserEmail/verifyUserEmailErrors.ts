import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `The user with id; ${userId} does not exist`,
        } as UseCaseError);
    }
}

export class TokenExpiredError extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `The token has expired; Please resend verification email`,
        } as UseCaseError);
    }
}

export class IncorrectTokenError extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `The token is incorrect, Please resend verification email`,
        } as UseCaseError);
    }
}
