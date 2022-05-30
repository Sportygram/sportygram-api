import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserIdDoesntExistError extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `User ID does not exist`,
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
