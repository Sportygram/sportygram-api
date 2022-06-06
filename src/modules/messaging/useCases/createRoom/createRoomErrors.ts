import { Result } from "../../../../lib/core/Result";
import { UseCaseError } from "../../../../lib/core/UseCaseError";

export class ChatUserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `Chat User with userId; ${userId} was found`,
        } as UseCaseError);
    }
}

export class StreamRoomCreationError extends Result<UseCaseError> {
    constructor(roomId: string) {
        super(false, {
            message: `Error creating room on getStream; id: ${roomId}`,
        } as UseCaseError);
    }
}