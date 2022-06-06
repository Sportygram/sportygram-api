import { roomReadRepo, roomRepo } from "../../repos";
import { streamService } from "../../services/getStream";
import { UpdateRoom } from "./updateRoom";
import { UpdateRoomImageController } from "./uploadRoomImageController";

export const updateRoom = new UpdateRoom(roomRepo, roomReadRepo, streamService);

export const updateRoomImageController = new UpdateRoomImageController(updateRoom);
