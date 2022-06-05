import { IDomainEvent } from "../../../../lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { ChatUser } from "../chatUser";

export class ChatUserAddedToRoom implements IDomainEvent {
    public dateTimeOccurred: Date;
    public chatUser: ChatUser;

    constructor(chatUser: ChatUser) {
        this.dateTimeOccurred = new Date();
        this.chatUser = chatUser;
    }

    getAggregateId(): UniqueEntityID {
        return this.chatUser.id;
    }
}
