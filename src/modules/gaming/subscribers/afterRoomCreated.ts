import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { RoomCreated } from "../../messaging/domain/events/roomCreated";
import { CreateRoomGames } from "../useCases/createRoomGames/createRoomGames";

export class AfterRoomCreated implements IHandle<RoomCreated> {
    constructor(private createRoomGames: CreateRoomGames) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onUserCreated.bind(this) as RegisterCallback,
            RoomCreated.name
        );
    }

    private async onUserCreated(event: RoomCreated): Promise<void> {
        const { room } = event;

        try {
            const createdOrError = await this.createRoomGames.execute({
                roomId: room.roomId.id.toString(),
            });

            if (createdOrError.isLeft()) {
                const playerError = createdOrError.value.error;
                const message =
                    typeof playerError === "string"
                        ? playerError
                        : playerError?.message;

                throw new Error(message);
            }
            logger.info(
                `[AfterRoomCreated]: Successfully executed CreateRoomGames use case AfterRoomCreated`,
                {
                    roomId: room.roomId,
                }
            );
        } catch (err) {
            logger.error(`[AfterRoomCreated]: ${err.message}`, {
                roomId: room.roomId,
            });
        }
    }
}
