import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class RoleDoesNotExistError extends Result<UseCaseError> {
    constructor(roleId: string) {
        super(false, {
            message: `The role with the id; ${roleId} does not exist`,
        } as UseCaseError);
    }
}

export class UserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `The user with id; ${userId} does not exist`,
        } as UseCaseError);
    }
}
