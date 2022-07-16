import { UserCreated } from "../../iam/domain/events/userCreated";
import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { CreateFirebaseUserForHuddleUser } from "../useCases/syncFirebaseUser/createFirebaseUserForHuddleUser";

export class AfterUserCreated implements IHandle<UserCreated> {
    constructor(
        private createFirebaseUserForHuddleUser: CreateFirebaseUserForHuddleUser
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onUserCreated.bind(this) as RegisterCallback,
            UserCreated.name
        );
    }

    private async onUserCreated(event: UserCreated): Promise<void> {
        const { user } = event;

        try {
            const result = await this.createFirebaseUserForHuddleUser.execute({
                user,
            });

            if (result.isLeft()) {
                const resultError = result.value.error;
                const message =
                    typeof resultError === "string"
                        ? resultError
                        : resultError?.message;

                throw new Error(message);
            }

            logger.info(
                `[AfterUserCreated]: Successfully executed createFirebaseUserForHuddleUser use case AfterUserCreated`,
                {
                    userId: user.userId,
                }
            );
        } catch (err) {
            logger.error(`[AfterUserCreated]: ${err.message}`, {
                userId: user.userId,
            });
        }
    }
}
