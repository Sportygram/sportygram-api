import { NexusGenObjects } from "../../../infra/http/graphql/nexus-typegen";
import { ChatUser } from "../domain/chatUser";
import { Room } from "../domain/room";

export interface RoomRepo {
    getRoomById(roomId: string): Promise<Room | undefined>;
    save(room: Room): Promise<void>;
}

export type QueryRoom = NexusGenObjects["Room"];
export interface RoomReadRepo {
    getRoomById(roomId: string): Promise<QueryRoom | undefined>;
}

export interface ChatUserRepo {
    getChatUserByUserId(userId: string): Promise<ChatUser | undefined>;
    save(chatUser: ChatUser): Promise<void>;
}

