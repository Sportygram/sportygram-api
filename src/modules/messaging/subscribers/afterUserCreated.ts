// import { User } from '../../iam/domain/user';
import { UserCreated } from "../../iam/domain/events/userCreated";
import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { CreateChatUser } from "../useCases/createChatUser/createChatUser";

export class AfterUserCreated implements IHandle<UserCreated> {

    constructor(private createChatUser: CreateChatUser) {
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
            const chatUser = await this.createChatUser.execute({
                userId: user.userId.id.toString(),
            });

            if (chatUser.isLeft()) {
                const chatUserError = chatUser.value.error;
                const message =
                    typeof chatUserError === "string"
                        ? chatUserError
                        : chatUserError?.message;

                throw new Error(message);
            }
            logger.info(
                `[AfterUserCreated]: Successfully executed CreateChatUser use case AfterUserCreated`,
                {
                    userId: user.userId,
                    chatUserId: chatUser.value.getValue().id.toString(),
                }
            );
        } catch (err) {
            logger.error(`[AfterUserCreated]: ${err.message}`, {
                userId: user.userId,
            });
        }
    }
}
