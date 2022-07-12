import { UserCreated } from "../../iam/domain/events/userCreated";
import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { CreatePlayer } from "../useCases/createPlayer/createPlayer";

export class AfterUserCreated implements IHandle<UserCreated> {
    constructor(private createPlayer: CreatePlayer) {
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
            const player = await this.createPlayer.execute({
                userId: user.userId.id.toString(),
            });

            if (player.isLeft()) {
                const playerError = player.value.error;
                const message =
                    typeof playerError === "string"
                        ? playerError
                        : playerError?.message;

                throw new Error(message);
            }
            logger.info(
                `[AfterUserCreated]: Successfully executed CreatePlayer use case AfterUserCreated`,
                {
                    userId: user.userId,
                    chatUserId: player.value.getValue().id.toString(),
                }
            );
        } catch (err) {
            logger.error(`[AfterUserCreated]: ${err.message}`, {
                userId: user.userId,
            });
        }
    }
}
