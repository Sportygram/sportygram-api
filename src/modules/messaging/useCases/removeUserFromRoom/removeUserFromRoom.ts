import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
// import { hasPermissions } from "../../../../lib/utils/permissions";
import { RemoveUserFromRoomDTO } from "./removeUserFromRoom.dto";
import { ChatUserRepo, RoomRepo } from "../../repos/interfaces";
import { GetStreamService } from "../../services/getStream/getStreamService";
import {
    ChatUserDoesNotExistError,
    RoomDoesNotExistError,
    StreamRoomUpdateError,
} from "../addUserToRoom/addUserToRoomErrors";
import { ChatUserRole } from "../../domain/chatUser";

type Response = Either<
    | ChatUserDoesNotExistError
    | RoomDoesNotExistError
    | StreamRoomUpdateError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<void>
>;

export class RemoveUserFromRoom
    implements UseCase<RemoveUserFromRoomDTO, Promise<Response>>
{
    constructor(
        private roomRepo: RoomRepo,
        private chatUserRepo: ChatUserRepo,
        private streamService: GetStreamService
    ) {}

    // @hasPermissions("CreateRoom", ["edit:room"])
    async execute(request: RemoveUserFromRoomDTO): Promise<Response> {
        const { userId, roomId } = request;

        try {
            // TODO: Allow room_moderator or me add user to room
            const chatUserAlreadyInRoom = await this.roomRepo.chatUserInRoom(
                roomId,
                userId
            );
            if (!chatUserAlreadyInRoom) {
                return right(Result.ok());
            }

            const chatUser = await this.chatUserRepo.getChatUserByUserId(
                userId
            );
            if (!chatUser) {
                return left(new ChatUserDoesNotExistError(userId));
            }
            chatUser.updateRole(ChatUserRole.ChannelMember);

            const room = await this.roomRepo.getRoomById(roomId);
            if (!room) {
                return left(new RoomDoesNotExistError(roomId));
            }

            room.removeMember(chatUser);

            const streamChannel = await this.streamService.removeMembers(roomId, [
                userId,
            ]);

            if (!streamChannel) {
                return left(new StreamRoomUpdateError(roomId));
            }
            room.updateStreamData(streamChannel);

            await this.roomRepo.save(room);

            return right(Result.ok());
        } catch (err) {
            return left(
                new AppError.UnexpectedError(
                    err,
                    this.constructor.name,
                    request
                )
            );
        }
    }
}
