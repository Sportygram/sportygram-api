import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { Match } from "../match";

export class AllMatchPredictionsScored implements IDomainEvent {
    public dateTimeOccurred: Date;

    constructor(public match: Match) {
        this.dateTimeOccurred = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.match.id;
    }
}
