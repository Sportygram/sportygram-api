import { JsonObject } from "swagger-ui-express";
import { prisma } from "../../../../infra/database/prisma/client";
import { Room } from "../../domain/room";
import { RoomMap } from "../../mappers/roomMap";
import { RoomRepo } from "../interfaces";

export class PrismaRoomRepo implements RoomRepo {
    async getRoomById(roomId: string): Promise<Room | undefined> {
        if (!roomId) return undefined;
        const roomEntity = await prisma.room.findUnique({
            where: { id: roomId },
        });
        if (!roomEntity) return undefined;

        return RoomMap.toDomain(roomEntity);
    }

    async save(room: Room): Promise<void> {
        const rawRoom = RoomMap.toPersistence(room);
        const roomEntity = {
            ...rawRoom,
            metadata: rawRoom.metadata as JsonObject,
        };

        const roomChatUsers: any = {};
        if (room.members) {
            roomChatUsers.createMany = {
                data: room.members.getNewItems().map((member) => ({
                    userId: member.userId.id.toString(),
                    role: member.role,
                })),
            };
        }

        const updateMany = room.members?.getItems().map((member) => ({
            where: {
                userId: {
                    equals: member.userId.id.toString(),
                },
                roomId: {
                    equals: rawRoom.id,
                },
            },
            data: {
                userId: member.userId.id.toString(),
                role: member.role,
            },
        }));

        const deletedMembers = room.members
            ?.getRemovedItems()
            .map((member) => ({
                userId: member.userId.id.toString(),
                role: member.role,
            }));

        await prisma.room.upsert({
            where: { id: rawRoom.id },
            update: {
                ...roomEntity,
                roomChatUsers: {
                    ...roomChatUsers,
                    updateMany,
                    deleteMany: deletedMembers,
                },
            },
            create: {
                ...roomEntity,
                roomChatUsers,
            },
        });
    }
}
