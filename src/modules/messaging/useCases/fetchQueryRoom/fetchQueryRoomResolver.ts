import { FieldResolver } from "nexus";
import { roomReadRepo } from "../../repos";

export const roomQueryResolver: FieldResolver<"Query", "room"> = async (
    _parent,
    args,
    _ctx
) => {
    const room = await roomReadRepo.getRoomById(args.roomId);
    if (!room) throw new Error("Room fetch Error");
    return room;
};
