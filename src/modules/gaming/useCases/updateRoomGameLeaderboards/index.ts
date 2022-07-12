import { roomGameRepo } from "../../repos";
import { UpdateRoomGameLeaderboards } from "./updateRoomGameLeaderboards";

export const updateRoomGameLeaderboards = new UpdateRoomGameLeaderboards(
    roomGameRepo,
);
