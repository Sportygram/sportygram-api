import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";


export class RoomDoesNotExistError extends Result<UseCaseError> {
    constructor(roomId: string) {
        super(false, {
            message: `Room with id; ${roomId} was not found`,
        } as UseCaseError);
    }
}
