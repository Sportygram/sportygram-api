import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserDoesNotExistError extends Result<UseCaseError> {
    constructor(email: string) {
        super(false, {
            message: `User with email; ${email} does not exist`,
        } as UseCaseError);
    }
}
