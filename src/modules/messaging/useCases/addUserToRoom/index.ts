import { chatUserRepo, roomRepo } from "../../repos";
import { streamService } from "../../services/getStream";
import { AddUserToRoom } from "./addUserToRoom";

export const addUserToRoom = new AddUserToRoom(
    roomRepo,
    chatUserRepo,
    streamService
);
