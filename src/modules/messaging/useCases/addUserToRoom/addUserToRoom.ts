import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
// import { hasPermissions } from "../../../../lib/utils/permissions";
import { AddUserToRoomDTO } from "./addUserToRoomDTO";
import { Room } from "../../domain/room";
import { ChatUserRepo, RoomRepo } from "../../repos/interfaces";
import { GetStreamService } from "../../services/getStream/getStreamService";
import {
    ChatUserDoesNotExistError,
    RoomDoesNotExistError,
    StreamRoomUpdateError,
} from "./addUserToRoomErrors";

type Response = Either<
    | ChatUserDoesNotExistError
    | RoomDoesNotExistError
    | StreamRoomUpdateError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<Room>
>;

export class AddUserToRoom
    implements UseCase<AddUserToRoomDTO, Promise<Response>>
{
    constructor(
        private roomRepo: RoomRepo,
        private chatUserRepo: ChatUserRepo,
        private streamService: GetStreamService
    ) {}

    // @hasPermissions("CreateRoom", ["edit:room"])
    async execute(request: AddUserToRoomDTO): Promise<Response> {
        const { userId, roomId } = request;

        try {
            const chatUser = await this.chatUserRepo.getChatUserByUserId(
                userId
            );
            if (!chatUser) {
                return left(new ChatUserDoesNotExistError(userId));
            }
            chatUser.updateRole("channel_member");

            const room = await this.roomRepo.getRoomById(roomId);
            if (!room) {
                return left(new RoomDoesNotExistError(roomId));
            }

            room.addMember(chatUser);

            const streamChannel = await this.streamService.addMembers(roomId, [
                chatUser.id.toString(),
            ]);

            if (!streamChannel) {
                return left(new StreamRoomUpdateError(roomId));
            }
            room.updateStreamData(streamChannel);
            
            await this.roomRepo.save(room);

            return right(Result.ok<Room>(room));
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
