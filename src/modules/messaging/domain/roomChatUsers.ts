import { WatchedList } from "../../../lib/domain/WatchedList";
import { ChatUser } from "./chatUser";

export class RoomChatUsers extends WatchedList<ChatUser> {
    private constructor(initialMembers: ChatUser[]) {
        super(initialMembers);
    }

    public compareItems(a: ChatUser, b: ChatUser): boolean {
        return a.equals(b);
    }

    public static create(chatUsers: ChatUser[]): RoomChatUsers {
        return new RoomChatUsers(chatUsers ? chatUsers : []);
    }
}
