// Update and score Match Predictions

import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { UpdateRoomGameLeaderboards } from "../useCases/updateRoomGameLeaderboards/updateRoomGameLeaderboards";
import { ChatUserAddedToRoom } from "../../messaging/domain/events/chatUserAddedToRoom";

export class AfterUserAddedToRoom implements IHandle<ChatUserAddedToRoom> {
    constructor(
        private updateRoomGameLeaderboards: UpdateRoomGameLeaderboards
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onLiveMatchUpdated.bind(this) as RegisterCallback,
            ChatUserAddedToRoom.name
        );
    }

    private async onLiveMatchUpdated(
        event: ChatUserAddedToRoom
    ): Promise<void> {
        const { room } = event;

        try {
            this.updateRoomGameLeaderboards.execute({
                roomId: room.id.toString(),
            });

            logger.info(
                `[AfterMatchQuestionAnswered]: Successfully updated room game leaderboards after ChatUserAddedToRoom`,
                { roomId: room.roomId }
            );
        } catch (err) {
            logger.error(
                `[AfterMatchQuestionAnswered]: Failed to update room game leaderboards after ChatUserAddedToRoom.`,
                { roomId: room.roomId }
            );
        }
    }
}
