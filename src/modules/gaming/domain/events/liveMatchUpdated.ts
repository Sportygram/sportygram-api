import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { Match } from "../match";
import { MatchEventData } from "../types";

export class LiveMatchUpdated implements IDomainEvent {
    public dateTimeOccurred: Date;

    constructor(public match: Match, public updates: MatchEventData[]) {
        this.dateTimeOccurred = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.match.id;
    }
}
