import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
        super(false, {
            message: `The email ${email} associated for this account already exists`,
        } as UseCaseError);
    }
}
