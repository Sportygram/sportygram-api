import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { User } from "../../../iam/domain/user";

export class FCMTokenUpdated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public user: User;

    constructor(user: User) {
        this.dateTimeOccurred = new Date();
        this.user = user;
    }

    getAggregateId(): UniqueEntityID {
        return this.user.id;
    }
}
