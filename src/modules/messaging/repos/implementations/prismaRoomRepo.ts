import dayjs from "dayjs";
import { JsonObject } from "swagger-ui-express";
import { prisma } from "../../../../infra/database/prisma/client";
import { LeaderboardPlayer } from "../../../gaming/domain/types";
import { Room } from "../../domain/room";
import { RoomMap } from "../../mappers/roomMap";
import { RoomRepo } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { RoomGameStatus, RoomGameType } from "@prisma/client";

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
        const defaultRoomGame = {
            id: uuidv4(),
            name: `EPL weekly game`,
            competitionId: 1,
            type: "weekly" as RoomGameType,
            status: "in_progress" as RoomGameStatus,
            summary: {},
            leaderboard: [] as LeaderboardPlayer[],
            expiringAt: dayjs()
                .add(1, "week")
                .startOf("week")
                .add(1, "day")
                .toISOString(),
        };

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

            defaultRoomGame.leaderboard = [
                ...defaultRoomGame.leaderboard,
                ...room.members.getNewItems().map((member) => ({
                    playerId: member.userId.id.toString(),
                    username: member.username,
                    rank: 1,
                    prevRank: 1,
                    score: 0,
                })),
            ];
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
                roomGames: {
                    createMany: {
                        data: [
                            defaultRoomGame,
                            {
                                ...defaultRoomGame,
                                id: uuidv4(),
                                name: `EPL season game`,
                                type: "season",
                                expiringAt: new Date("2023-05-29"),
                            },
                        ],
                    },
                },
            },
        });
    }
}
