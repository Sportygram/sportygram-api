import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
// import { hasPermissions } from "../../../../lib/utils/permissions";
import { UpdateChatUserRoleDTO } from "./updateChatUserRoleDTO";
import { Room } from "../../domain/room";
import { ChatUserRepo, RoomRepo } from "../../repos/interfaces";
import { GetStreamService } from "../../services/getStream/getStreamService";
import {
    ChatUserDoesNotExistError,
    RoomDoesNotExistError,
    StreamRoomUpdateError,
} from "./updateChatUserRoleErrors";
import { ChatUserRole } from "../../domain/chatUser";

type Response = Either<
    | ChatUserDoesNotExistError
    | RoomDoesNotExistError
    | StreamRoomUpdateError
    | AppError.InputError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<Room>
>;

export class UpdateChatUserRole
    implements UseCase<UpdateChatUserRoleDTO, Promise<Response>>
{
    constructor(
        private roomRepo: RoomRepo,
        private chatUserRepo: ChatUserRepo,
        private streamService: GetStreamService
    ) {}

    // @hasPermissions("CreateRoom", ["edit:room"])
    async execute(request: UpdateChatUserRoleDTO): Promise<Response> {
        const { userId, roomId, role } = request;

        try {
            const chatUser = await this.chatUserRepo.getChatUserByUserId(
                userId
            );
            if (!chatUser) {
                return left(new ChatUserDoesNotExistError(userId));
            }

            const room = await this.roomRepo.getRoomById(roomId);
            if (!room) {
                return left(new RoomDoesNotExistError(roomId));
            }

            const updatedOrError = chatUser.updateRole(role);
            if (updatedOrError.isFailure) {
                return left(new AppError.InputError(updatedOrError.error));
            }
            room.updateExistingMember(chatUser);

            let updated: any;
            if (role === ChatUserRole.Moderator) {
                updated = await this.streamService.addModerators(roomId, [
                    userId,
                ]);
            } else {
                updated = await this.streamService.demoteModerators(roomId, [
                    userId,
                ]);
            }

            if (!updated) {
                return left(new StreamRoomUpdateError(roomId));
            }
            room.updateStreamData(updated);

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
