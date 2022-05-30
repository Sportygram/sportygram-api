import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserDoesntExistError extends Result<UseCaseError> {
    constructor(email: string) {
        super(false, {
            message: `No user with the email; ${email} was found`,
        } as UseCaseError);
    }
}
export class PermissionError extends Result<UseCaseError> {
    constructor(email: string) {
        super(false, {
            message: `You do not have permissions fetch this user; ${email}, Please login and retry.`,
        } as UseCaseError);
    }
}
