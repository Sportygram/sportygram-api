import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUserId } from "./chatUserId";
import { ChatUserCreated } from "./events/chatUserCreated";

type ChatUserRole = "user" | "admin" | "channel_member" | "channel_moderator";
export type ChatUserMetadata = {
    stream?: { token?: string; data: any };
};

interface ChatUserProps {
    displayName?: string;
    role?: ChatUserRole;
    coinBalance: number;
    metadata: ChatUserMetadata;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ChatUser extends AggregateRoot<ChatUserProps> {
    get chatUserId(): ChatUserId {
        return ChatUserId.create(this._id).getValue();
    }

    get displayName(): string | undefined {
        return this.props.displayName;
    }
    get role() {
        return this.props.role;
    }
    get coinBalance() {
        return this.props.coinBalance;
    }
    get metadata(): ChatUserMetadata {
        return this.props.metadata || { stream: { data: {} } };
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    public updateRole(role: ChatUserRole): Result<void> {
        this.props.role = role;
        return Result.ok();
    }

    public updateStreamData(streamData: any, token?: string): Result<void> {
        const current = this.metadata.stream || { data: {} };
        this.props.metadata.stream = {
            ...current,
            token: token || current?.token,
            data: { ...current.data, ...streamData },
        };
        return Result.ok();
    }

    private constructor(roleProps: ChatUserProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static isValidRoleName(roleName: string): boolean {
        return !!roleName.trim() && roleName.split(" ").length === 1;
    }

    public static create(
        props: ChatUserProps,
        id?: UniqueEntityID
    ): Result<ChatUser> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.displayName, argumentName: "username" },
            { argument: props.role, argumentName: "role" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<ChatUser>(guardResult.message || "");
        }

        const chatUser = new ChatUser({ ...props }, id);
        const isNewChatUser = !id;

        if (isNewChatUser) {
            chatUser.addDomainEvent(new ChatUserCreated(chatUser));
        }
        return Result.ok<ChatUser>(chatUser);
    }
}
