import { IDomainEvent } from "./IDomainEvent";
import { AggregateRoot } from "../AggregateRoot";
import { UniqueEntityID } from "../UniqueEntityID";

export type RegisterCallback = (event: IDomainEvent) => Promise<void>;
export class DomainEvents {
    private static handlersMap = {} as { [handler: string]: any };
    private static markedAggregates: AggregateRoot<any>[] = [];

    private static findMarkedAggregateByID(
        id: UniqueEntityID
    ): AggregateRoot<any> | null {
        let found: AggregateRoot<any> | null = null;
        for (const aggregate of this.markedAggregates) {
            if (aggregate.id.equals(id)) {
                found = aggregate;
            }
        }
        return found;
    }

    public static markAggregateForDispatch(
        aggregate: AggregateRoot<any>
    ): void {
        const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

        if (!aggregateFound) {
            this.markedAggregates.push(aggregate);
        }
    }

    /**
     * dispatchEventsForAggregate
     */
    public static dispatchEventsForAggregate(id: UniqueEntityID): void {
        const aggregate = this.findMarkedAggregateByID(id);

        if (aggregate) {
            this.dispatchAggregateEvents(aggregate);
            aggregate.clearEvents();
            this.removeAggregateFromMarkedDispatchList(aggregate);
        }
    }

    public static register(
        callback: RegisterCallback,
        eventClassName: string
    ): void {
        if (!this.handlersMap.hasOwnProperty(eventClassName)) {
            this.handlersMap[eventClassName] = [];
        }
        this.handlersMap[eventClassName].push(callback);
    }

    public static clearHandlers(): void {
        this.handlersMap = {};
    }

    public static clearMarkedAggregates(): void {
        this.markedAggregates = [];
    }

    private static dispatchAggregateEvents(
        aggregate: AggregateRoot<any>
    ): void {
        aggregate.domainEvents.forEach((event: IDomainEvent) =>
            this.dispatch(event)
        );
    }

    private static removeAggregateFromMarkedDispatchList(
        aggregate: AggregateRoot<any>
    ): void {
        const index = this.markedAggregates.findIndex((a) =>
            a.equals(aggregate)
        );
        this.markedAggregates.splice(index, 1);
    }

    private static dispatch(event: IDomainEvent): void {
        const eventClassName: string = event.constructor.name;

        if (this.handlersMap.hasOwnProperty(eventClassName)) {
            const handlers: any[] = this.handlersMap[eventClassName];
            for (const handler of handlers) {
                handler(event);
            }
        }
    }

    public static dispatchEventsHook(id: any) {
        const aggregateId = new UniqueEntityID(id);
        DomainEvents.dispatchEventsForAggregate(aggregateId);
    }
}
