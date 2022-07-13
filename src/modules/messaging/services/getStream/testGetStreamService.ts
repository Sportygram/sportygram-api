import { UserResponse, DefaultGenerics, ChannelResponse } from "stream-chat";
import { GetStreamService, UserUpdate } from "./getStreamService";

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzNkMWNlZDgtMmRiZS00Yjc5LThlOTctYzA2ZTYyNjc3ZGQwIn0.T4YNNKrutH6zT5z6b4mdw43ziSAVXcr-cSDmQcGksic";
const streamUserData = {
    id: "edc7d107-b277-48d5-9c70-6dc043e5bdac",
    role: "user",
    created_at: "2022-06-06T09:42:10.83619Z",
    updated_at: "2022-06-06T09:42:10.83619Z",
    banned: false,
    online: false,
};
const streamChannel = {
    id: "ad12562d-6611-4ea0-a2bf-f0f7863bbf45",
    type: "messaging",
    cid: "messaging:ad12562d-6611-4ea0-a2bf-f0f7863bbf45",
    created_at: "2022-06-06T10:38:29.141055Z",
    updated_at: "2022-06-06T10:38:29.141055Z",
    created_by: {
        id: "73d1ced8-2dbe-4b79-8e97-c06e62677dd0",
        role: "user",
        created_at: "2022-06-06T09:53:49.304803Z",
        updated_at: "2022-06-06T09:53:49.304803Z",
        banned: false,
        online: false,
    },
    frozen: false,
    disabled: false,
    member_count: 1,
    config: {
        created_at: "2022-05-25T15:43:42.475577266Z",
        updated_at: "2022-05-25T15:43:42.475580753Z",
        name: "messaging",
        typing_events: true,
        read_events: true,
        connect_events: true,
        search: true,
        reactions: true,
        replies: true,
        quotes: true,
        mutes: true,
        uploads: true,
        url_enrichment: true,
        custom_events: true,
        push_notifications: true,
        reminders: false,
        message_retention: "infinite",
        max_message_length: 5000,
        automod: "disabled",
        automod_behavior: "flag",
        commands: [
            {
                name: "giphy",
                description: "Post a random gif to the channel",
                args: "[text]",
                set: "fun_set",
            },
        ],
    },
    own_capabilities: [
        "ban-channel-members",
        "connect-events",
        "delete-any-message",
        "delete-channel",
        "delete-own-message",
        "flag-message",
        "freeze-channel",
        "join-channel",
        "leave-channel",
        "mute-channel",
        "pin-message",
        "quote-message",
        "read-events",
        "search-messages",
        "send-custom-events",
        "send-links",
        "send-message",
        "send-reaction",
        "send-reply",
        "send-typing-events",
        "set-channel-cooldown",
        "typing-events",
        "update-any-message",
        "update-channel",
        "update-channel-members",
        "update-own-message",
        "upload-file",
    ],
    hidden: false,
    name: "Chelsea Huddle",
};

export class TestGetStreamService implements GetStreamService {
    getUserById(
        _userId: string
    ): Promise<UserResponse<DefaultGenerics> | undefined> {
        throw new Error("Method not implemented.");
    }
    async createToken(_userId: string): Promise<string> {
        return token;
    }

    async createOrReplaceUser(
        userData: any
    ): Promise<{ [key: string]: UserResponse<DefaultGenerics> }> {
        return {
            ...streamUserData,
            ...userData,
        };
    }
    createOrReplaceUsers(
        _userData: any[]
    ): Promise<{ [key: string]: UserResponse<DefaultGenerics> }> {
        throw new Error("Method not implemented.");
    }
    updateUser(
        _userId: string,
        _set: any,
        _unset: any
    ): Promise<{ [key: string]: UserResponse<DefaultGenerics> }> {
        throw new Error("Method not implemented.");
    }
    updateUsers(_updates: UserUpdate[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deactivateUser(_userId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    activateUser(_userId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteUser(_userId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    getChannel(_channelId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async createChannel(
        _type: string,
        _channelId?: string,
        _custom?: any
    ): Promise<ChannelResponse<DefaultGenerics>> {
        return streamChannel as any;
    }
    updateChannel(_channelId: string, _data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    sendMessageToChannel(
        _channelId: string,
        _message: string,
        _userId?: string
    ): Promise<any> {
        throw new Error("Method not implemented.");
    }

    addMembers(_channelId: string, _userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    removeMembers(_channelId: string, _userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    addModerators(_channelId: string, _userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    demoteModerators(_channelId: string, _userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
