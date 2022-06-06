import {
    ChannelResponse,
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
        set: any,
        unset: any
    ): Promise<{ [key: string]: UserResponse<DefaultGenerics> }>;
    updateUsers(updates: UserUpdate[]): Promise<any>;
    deactivateUser(userId: string): Promise<any>;
    activateUser(userId: string): Promise<any>;
    deleteUser(userId: string): Promise<any>;

    getChannel(channelId: string): Promise<any | undefined>;
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

    addMembers(userIds: string[]): Promise<any>;
    removeMembers(userIds: string[]): Promise<any>;
    addModerators(userIds: string[]): Promise<any>;
    demoteModerators(userIds: string[]): Promise<any>;
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
        if (error.config) delete error.config;
        if (error.request) delete error.request;
        logger.error("[Stream Error]", error);
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
    async updateUser(userId: string, set: any, unset: any) {
        const update = {
            id: userId,
            set,
            unset,
        };
        // response will contain user object with updated users info
        const response = await this.client.partialUpdateUser(update);
        return response.users;
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
    async getChannel() {
        throw new Error("Method not implemented.");
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
    async updateChannel(_channelId: string, _data: any) {
        throw new Error("Method not implemented.");
        // const update = await this.client.channel.update({
        //     name: "myspecialchannel",
        //     image: "imageurl",
        //     mycustomfield: "123",
        // });
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
    async addMembers(_userIds: string[]) {
        throw new Error("Method not implemented.");
    }
    async removeMembers(_userIds: string[]) {
        throw new Error("Method not implemented.");
    }
    async addModerators(_userIds: string[]) {
        throw new Error("Method not implemented.");
    }
    async demoteModerators(_userIds: string[]) {
        throw new Error("Method not implemented.");
    }
    //#endregion
}
