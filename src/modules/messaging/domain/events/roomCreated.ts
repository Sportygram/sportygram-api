import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { Room } from "../room";

export class RoomCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public room: Room;

    constructor(room: Room) {
        this.dateTimeOccurred = new Date();
        this.room = room;
    }

    getAggregateId(): UniqueEntityID {
        return this.room.id;
    }
}
