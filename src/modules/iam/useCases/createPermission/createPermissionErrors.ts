import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class PermissionAlreadyExistsError extends Result<UseCaseError> {
    constructor(permissionValue: string) {
        super(false, {
            message: `This permission ${permissionValue} already exists`,
        } as UseCaseError);
    }
}
