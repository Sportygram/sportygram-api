import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { Game } from "../game";

export class GameCreated implements IDomainEvent {
    public dateTimeOccurred: Date;

    constructor(public game: Game) {
        this.dateTimeOccurred = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.game.id;
    }
}
