import { UseCaseError } from "../../../../lib/core/UseCaseError";
import { Result } from "../../../../lib/core/Result";

export class UserDoesNotExistError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `No user with the userId; ${userId} was found`,
        } as UseCaseError);
    }
}

export class UserDoesNotHaveFCMTokenError extends Result<UseCaseError> {
    constructor(userId: string) {
        super(false, {
            message: `User with userId; ${userId} does not have an FCM Token before topic update`,
        } as UseCaseError);
    }
}

export class FCMTopicUpdateError extends Result<UseCaseError> {
    constructor(userId: string, set?: string, unset?: string) {
        super(false, {
            message: `Error updating user FCM Topics on firebase for ${userId}; set ${set}, unset ${unset}`,
        } as UseCaseError);
    }
}
