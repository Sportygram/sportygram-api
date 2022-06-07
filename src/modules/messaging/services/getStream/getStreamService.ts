import {
    ChannelResponse,
    Channel,
    DefaultGenerics,
    StreamChat,
    UserResponse,
} from "stream-chat";
import logger from "../../../../lib/core/Logger";

export type UserUpdate = {
    id: string;
    set?: any;
    unset?: any;
};

export const StreamChannelType = {
    Messaging: "messaging",
};
export interface GetStreamService {
    createToken(userId: string): Promise<string>;

    createOrReplaceUser(
        userData: any
    ): Promise<{ [key: string]: UserResponse<DefaultGenerics> } | undefined>;
    createOrReplaceUsers(
        userData: any[]
    ): Promise<{ [key: string]: UserResponse<DefaultGenerics> } | undefined>;
    updateUser(
        userId: string,
        set?: any,
        unset?: any
    ): Promise<{ [key: string]: UserResponse<DefaultGenerics> } | undefined>;
    updateUsers(updates: UserUpdate[]): Promise<any>;
    deactivateUser(userId: string): Promise<any>;
    activateUser(userId: string): Promise<any>;
    deleteUser(userId: string): Promise<any>;

    getChannel(
        channelId: string
    ): Promise<Channel<DefaultGenerics> | undefined>;
    createChannel(
        type: string,
        channelId?: string,
        custom?: any
    ): Promise<ChannelResponse<DefaultGenerics> | undefined>;
    updateChannel(channelId: string, data: any): Promise<any>;
    sendMessageToChannel(
        channelId: string,
        message: string,
        userId?: string
    ): Promise<any>;

    addMembers(channelId: string, chatUserIds: string[]): Promise<any>;
    removeMembers(channelId: string, chatUserIds: string[]): Promise<any>;
    addModerators(channelId: string, chatUserIds: string[]): Promise<any>;
    demoteModerators(channelId: string, chatUserIds: string[]): Promise<any>;
}

export class GetStreamServiceImpl implements GetStreamService {
    private client: StreamChat;

    constructor(streamConfig: any) {
        const { apiKey, apiSecret } = streamConfig;
        this.client = StreamChat.getInstance(apiKey, apiSecret, {
            timeout: 6000,
        });
    }

    log(error: any) {
        let errorData: any = {};
        if (error.response) {
            errorData.data = error.response.data;
            errorData.status = error.response.status;
        } else if (error.request) {
            errorData.data = error.request;
        } else errorData = error;
        
        logger.error("[Stream Error]", errorData);
    }

    async createToken(userId: string) {
        return this.client.createToken(userId);
    }

    //#region Users
    /** Create or Replace users */
    async createOrReplaceUser(userData: any) {
        try {
            const response = await this.client.upsertUser(userData);
            return response.users;
        } catch (error) {
            this.log(error);
            return undefined;
        }
    }
    async createOrReplaceUsers(userData: any[]) {
        try {
            const response = await this.client.upsertUsers(userData);
            return response.users;
        } catch (err) {
            this.log(err);
            return undefined;
        }
    }
    async updateUser(userId: string, set?: any, unset?: any) {
        const update = {
            id: userId,
            set,
            unset,
        };
        // response will contain user object with updated users info
        try {
            const response = await this.client.partialUpdateUser(update);
            return response.users;
        } catch (error) {
            this.log(error);
            return undefined;
        }
    }
    async updateUsers(_updates: UserUpdate[]) {
        throw new Error("Method not implemented.");
    }
    async deactivateUser(_userId: string) {
        throw new Error("Method not implemented.");
    }
    async activateUser(_userId: string) {
        throw new Error("Method not implemented.");
    }
    async deleteUser(_userId: string) {
        throw new Error("Method not implemented.");
    }
    //#endregion

    //#region Channels
    async getChannel(
        channelId: string
    ): Promise<Channel<DefaultGenerics> | undefined> {
        const filter = { id: { $eq: channelId } };
        try {
            const channels = await this.client.queryChannels(filter);
            return channels[0] || undefined;
        } catch (error) {
            this.log(error);
            return undefined;
        }
    }
    async createChannel(type: string, channelId?: string, custom?: any) {
        try {
            const channel = this.client.channel(type, channelId, custom);
            await channel.create();
            const updatedChannel = await channel.assignRoles([
                {
                    user_id: custom.members[0],
                    channel_role: "channel_moderator",
                },
            ]);
            return updatedChannel.channel;
        } catch (err) {
            this.log(err);
            return undefined;
        }
    }
    async updateChannel(channelId: string, set?: any, unset?: any) {
        try {
            const channel = this.client.channel(
                StreamChannelType.Messaging,
                channelId
            );
            const update = {
                set,
                unset,
            };
            const response = await channel.updatePartial(update);
            return response.channel;
        } catch (error) {
            // TODO: Log to database and retry
            this.log(error);
            return undefined;
        }
    }
    async sendMessageToChannel(
        _channelId: string,
        _message: string,
        _userId?: string
    ) {
        throw new Error("Method not implemented.");
    }
    //#endregion

    //#region  Members
    async addMembers(channelId: string, chatUserIds: string[]) {
        try {
            const channel = this.client.channel(
                StreamChannelType.Messaging,
                channelId
            );
            const updatedChannel = await channel.addMembers(chatUserIds);
            return updatedChannel.channel;
        } catch (err) {
            this.log(err);
            return undefined;
        }
    }
    async removeMembers(_channelId: string, _userIds: string[]) {
        throw new Error("Method not implemented.");
    }
    async addModerators(_channelId: string, _userIds: string[]) {
        throw new Error("Method not implemented.");
    }
    async demoteModerators(_channelId: string, _userIds: string[]) {
        throw new Error("Method not implemented.");
    }
    //#endregion
}
