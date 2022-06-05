import { prisma } from "../../../../infra/database/prisma/client";
import { RoomType } from "../../domain/room";
import { QueryRoom, RoomReadRepo } from "../interfaces";

export class PrismaRoomReadRepo implements RoomReadRepo {
    async getRoomById(roomId: string): Promise<QueryRoom | undefined> {
        if (!roomId) return undefined;
        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });
        if (!room) return undefined;

        return {
            ...room,
            roomType: room.roomType as RoomType,
            games: [],
        };
    }
}
