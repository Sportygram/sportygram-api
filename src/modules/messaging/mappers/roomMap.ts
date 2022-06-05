import { Room as PRoom } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUserId } from "../domain/chatUserId";
import { Room, RoomMetadata } from "../domain/room";

export type RawRoom = Pick<
    PRoom,
    "id" | "name" | "joiningFee" | "metadata" | "roomType" | "createdById"
> &
    Partial<PRoom>;

export class RoomMap {
    // public static toDTO(chatUser: ChatUser): ChatUserDTO {
    //     return {
    //         id: chatUser.chatUserId.id.toString(),
    //         name: chatUser.name,
    //         description: chatUser.description,
    //     };
    // }

    public static toDomain(raw: RawRoom): Room | undefined {
        const createdById = ChatUserId.create(
            new UniqueEntityID(raw.createdById)
        ).getValue();

        const roomOrError = Room.create(
            {
                name: raw.name,
                description: raw.description || undefined,
                roomType: raw.roomType,
                roomImageUrl: raw.roomImageUrl || undefined,
                joiningFee: raw.joiningFee,
                createdById,
                metadata: (raw.metadata as RoomMetadata) || {},
            },
            new UniqueEntityID(raw.id)
        );
        return roomOrError.isSuccess ? roomOrError.getValue() : undefined;
    }

    public static toPersistence(room: Room): RawRoom {
        return {
            id: room.roomId.id.toString(),
            name: room.name,
            description: room.description || null,
            roomType: room.roomType,
            createdById: room.createdById.id.toString(),
            roomImageUrl: room.roomImageUrl || null,
            joiningFee: room.joiningFee,
            metadata: room.metadata,
        };
    }
}
