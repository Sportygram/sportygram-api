import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { Room } from "../room";

export class ChatUserRemovedFromRoom implements IDomainEvent {
    public dateTimeOccurred: Date;

    constructor(public room: Room) {
        this.dateTimeOccurred = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.room.id;
    }
}
