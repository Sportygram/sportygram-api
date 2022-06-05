import { Result } from "../../../../lib/core/Result";
import { UseCaseError } from "../../../../lib/core/UseCaseError";

export class ChatUserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `Chat User with userId; ${userId} was found`,
        } as UseCaseError);
    }
}