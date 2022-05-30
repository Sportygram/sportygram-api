import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class RoleAlreadyExistsError extends Result<UseCaseError> {
    constructor(roleName: string) {
        super(false, {
            message: `The role ${roleName} already exists`,
        } as UseCaseError);
    }
}
