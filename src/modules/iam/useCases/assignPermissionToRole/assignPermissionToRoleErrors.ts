import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class RoleDoesNotExistError extends Result<UseCaseError> {
    constructor(roleId: string) {
        super(false, {
            message: `The role with the id; ${roleId} does not exist`,
        } as UseCaseError);
    }
}

export class PermissionDoesNotExistError extends Result<UseCaseError> {
    constructor(permission: string) {
        super(false, {
            message: `The permission with the value; ${permission} does not exist`,
        } as UseCaseError);
    }
}
