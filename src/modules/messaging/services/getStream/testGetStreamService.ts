import { UserResponse, DefaultGenerics, ChannelResponse } from "stream-chat";
import { GetStreamService, UserUpdate } from "./getStreamService";

export class TestGetStreamService implements GetStreamService {
    createToken(_userId: string): Promise<string> {
        throw new Error("Method not implemented.");
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
    createChannel(
        _type: string,
        _channelId?: string,
        _custom?: any
    ): Promise<ChannelResponse<DefaultGenerics>> {
        throw new Error("Method not implemented.");
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

    addMembers(_userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    removeMembers(_userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    addModerators(_userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    demoteModerators(_userIds: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
