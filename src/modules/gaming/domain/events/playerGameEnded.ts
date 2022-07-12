import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { PlayerGameSummary } from "../gameSummary";
import { Player } from "../player";

export class PlayerGameEnded implements IDomainEvent {
    public dateTimeOccurred: Date;

    constructor(public player: Player, public gameSummary: PlayerGameSummary) {
        this.dateTimeOccurred = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.player.id;
    }
}
