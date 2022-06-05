import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
// import { hasPermissions } from "../../../../lib/utils/permissions";
import { CreateRoomDTO } from "./createRoomDTO";
import { Room } from "../../domain/room";
import { ChatUserRepo, RoomRepo } from "../../repos/interfaces";
import { RoomChatUsers } from "../../domain/roomChatUsers";
import { UserProfileDoesNotExistError } from "../createChatUser/createChatUserErrors";
import { GetStreamService } from "../../services/getStream/getStreamService";
import { ChatUserDoesNotExistError } from "./createRoomErrors";

type Response = Either<
    | UserProfileDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<Room>
>;

export class CreateRoom implements UseCase<CreateRoomDTO, Promise<Response>> {
    constructor(
        private roomRepo: RoomRepo,
        private chatUserRepo: ChatUserRepo,
        private streamService: GetStreamService
    ) {}

    // @hasPermissions("CreateRoom", ["edit:room"])
    async execute(request: CreateRoomDTO): Promise<Response> {
        const { name, description, createdBy, roomType } = request;

        try {
            /* 
            Check request user can create group
            Fetch creator chatUser Id
                Creator will the first member of the group
            Create group
            Create stream group
            

            */
            const chatUser = await this.chatUserRepo.getChatUserByUserId(
                createdBy
            );
            if (!chatUser) {
                return left(new ChatUserDoesNotExistError(createdBy));
            }

            const roomOrError: Result<Room> = Room.create({
                name,
                description,
                createdById: chatUser.chatUserId,
                roomType,
                joiningFee: 0,
                metadata: {},
                members: RoomChatUsers.create([chatUser]),
            });

            if (roomOrError.isFailure && roomOrError.error) {
                return left(new AppError.InputError(roomOrError.error));
            }

            const room = roomOrError.getValue();
            const streamChannel = await this.streamService.createChannel(
                "messaging",
                room.roomId.id.toString(),
                {
                    name: room.name,
                    members: [chatUser.chatUserId.id.toString()],
                }
            );

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
