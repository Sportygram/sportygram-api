import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { UserId } from "../../users/domain/userId";
import { ChatUserId } from "./chatUserId";
import { ChatUserCreated } from "./events/chatUserCreated";

export const ChatUserRole = {
    User: "user",
    Admin: "admin",
    ChannelMember: "channel_member",
    Moderator: "channel_moderator",
} as const;
export type ChatUserRole = typeof ChatUserRole[keyof typeof ChatUserRole];

export type ChatUserMetadata = {
    stream?: { token?: string; data: any };
};

interface ChatUserProps {
    userId: UserId;
    username?: string;
    displayName?: string;
    role?: string;
    coinBalance: number;
    metadata: ChatUserMetadata;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ChatUser extends AggregateRoot<ChatUserProps> {
    get chatUserId(): ChatUserId {
        return ChatUserId.create(this._id).getValue();
    }
    get userId() {
        return this.props.userId;
    }

    get username(): string | undefined {
        return this.props.username;
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

    public updateRole(roleStr: string): Result<void> {
        const role = roleStr.toLowerCase() as ChatUserRole;
        const roleTypeGuard = Guard.isValidValueOfObjectType<ChatUserRole>(
            role,
            ChatUserRole,
            "role"
        );
        if (!roleTypeGuard.succeeded) {
            return Result.fail<void>("Invalid role");
        }
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
            { argument: props.coinBalance, argumentName: "coinBalance" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<ChatUser>(guardResult.message || "");
        }

        const role = props.role?.toLowerCase() as ChatUserRole;
        if (role) {
            const roleTypeGuard = Guard.isValidValueOfObjectType<ChatUserRole>(
                role,
                ChatUserRole,
                "role"
            );
            if (!roleTypeGuard.succeeded) {
                return Result.fail<ChatUser>("Invalid role");
            }
        }

        const chatUser = new ChatUser({ ...props, role }, id);
        const isNewChatUser = !id;

        if (isNewChatUser) {
            chatUser.addDomainEvent(new ChatUserCreated(chatUser));
        }
        return Result.ok<ChatUser>(chatUser);
    }
}
