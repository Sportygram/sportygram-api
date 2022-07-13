import { NexusGenObjects } from "../../../infra/http/graphql/nexus-typegen";
import { ChatUser } from "../domain/chatUser";
import { Room } from "../domain/room";

export interface RoomWithPlayers {
    roomId: string;
    players: {
        playerId: string;
        username: string;
    }[];
}

export interface RoomRepo {
    getRoomIdsWithPlayers(roomId?: string): Promise<RoomWithPlayers[]>;
    chatUserInRoom(roomId: string, userId: string): Promise<boolean>;
    getRoomById(roomId: string): Promise<Room | undefined>;
    save(room: Room): Promise<void>;
}

export type QueryRoom = NexusGenObjects["Room"];
export type QueryRoomGame = NexusGenObjects["RoomGame"];
export interface RoomReadRepo {
    getRoomById(roomId: string): Promise<QueryRoom | undefined>;
}

export interface ChatUserRepo {
    getChatUserByUserId(userId: string): Promise<ChatUser | undefined>;
    save(chatUser: ChatUser): Promise<void>;
}
