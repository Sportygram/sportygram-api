import { prisma } from "../../../../infra/database/prisma/client";
import { RoomType } from "../../domain/room";
import { QueryRoom, QueryRoomGame, RoomReadRepo } from "../interfaces";

export class PrismaRoomReadRepo implements RoomReadRepo {
    async getRoomById(roomId: string): Promise<QueryRoom | undefined> {
        if (!roomId) return undefined;
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                roomGames: true,
                roomChatUsers: {
                    select: {
                        userId: true,
                        chatUser: {
                            select: {
                                userId: true,
                                displayName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
            },
        });

        if (!room) return undefined;

        room.roomGames.forEach((roomGame: any) => {
            roomGame.leaderboard = roomGame.leaderboard.map((player: any) => {
                const roomChatUser = room.roomChatUsers.find(
                    (roomChatUser) => player.playerId === roomChatUser.userId
                );
                const chatUser = roomChatUser?.chatUser;
                if (!chatUser) return undefined;
                return {
                    ...player,
                    name: chatUser.displayName,
                    username: player.username || "",
                    profileImageUrl: chatUser.profileImageUrl || "",
                    rankStatus:
                        player.rank === player.prevRank
                            ? "same"
                            : player.rank > player.prevRank
                            ? "up"
                            : "down",
                };
            });
        });

        return {
            ...room,
            roomType: room.roomType as RoomType,
            games: room.roomGames as QueryRoomGame[],
        };
    }
}
