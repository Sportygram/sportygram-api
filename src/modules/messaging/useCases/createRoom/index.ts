import { chatUserRepo, roomRepo } from "../../repos";
import { streamService } from "../../services/getStream";
import { CreateRoom } from "./createRoom";

export const createRoom = new CreateRoom(roomRepo, chatUserRepo, streamService);
