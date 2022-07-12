import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { RoomGame } from "../roomGame";

export class RoomGameCompleted implements IDomainEvent {
    public dateTimeOccurred: Date;

    constructor(public roomGame: RoomGame) {
        this.dateTimeOccurred = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.roomGame.id;
    }
}
