import { Result } from "../../../../lib/core/Result";
import { UseCaseError } from "../../../../lib/core/UseCaseError";

export class UserProfileDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `No user with the userId; ${userId} was found`,
        } as UseCaseError);
    }
}

export class StreamUserCreationError extends Result<UseCaseError> {
    constructor(streamId: string) {
        super(false, {
            message: `Error creating user on getStream; id: ${streamId}`,
        } as UseCaseError);
    }
}