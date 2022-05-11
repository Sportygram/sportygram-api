import { Entity } from "./Entity";
import { DomainEvents } from "./events/DomainEvents";
import { IDomainEvent } from "./events/IDomainEvent";
import { UniqueEntityID } from "./UniqueEntityID";
import logger from "../core/Logger";

export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: IDomainEvent[] = [];
    get id(): UniqueEntityID {
        return this._id;
    }

    get domainEvents(): IDomainEvent[] {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: IDomainEvent): void {
        this._domainEvents.push(domainEvent);

        DomainEvents.markAggregateForDispatch(this);
        this.logDomainEventsAdded(domainEvent);
    }

    public clearEvents(): void {
        this._domainEvents.splice(0, this._domainEvents.length);
    }

    private logDomainEventsAdded(domainEvent: IDomainEvent): void {
        const thisClass = Reflect.getPrototypeOf(this);
        const domainEventClass = Reflect.getPrototypeOf(domainEvent);
        logger.info(
            `[Domain Event Created]: ${thisClass?.constructor.name} ==> ${domainEventClass?.constructor.name}`,
            { event: domainEvent }
        );
    }
}
