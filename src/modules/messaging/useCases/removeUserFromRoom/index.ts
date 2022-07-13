import { chatUserRepo, roomRepo } from "../../repos";
import { streamService } from "../../services/getStream";
import { RemoveUserFromRoom } from "./removeUserFromRoom";

export const removeUserFromRoom = new RemoveUserFromRoom(
    roomRepo,
    chatUserRepo,
    streamService
);
