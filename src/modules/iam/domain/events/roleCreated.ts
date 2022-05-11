import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { Role } from "../role";

export class RoleCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public role: Role;

    constructor(role: Role) {
        this.dateTimeOccurred = new Date();
        this.role = role;
    }

    getAggregateId(): UniqueEntityID {
        return this.role.id;
    }
}
