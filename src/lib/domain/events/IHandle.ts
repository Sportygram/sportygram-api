import { IDomainEvent } from "./IDomainEvent";

export interface IHandle<_T extends IDomainEvent> {
    setupSubscriptions(): void;
}
