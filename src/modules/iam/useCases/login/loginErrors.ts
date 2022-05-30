import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `Email or Username or password is incorrect`,
        } as UseCaseError);
    }
}
export class PasswordDoesntMatchError extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `Email or Username or password is incorrect`,
        } as UseCaseError);
    }
}
