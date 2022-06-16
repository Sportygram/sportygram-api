import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
// import { hasPermissions } from "../../../../lib/utils/permissions";
import { CreateRoomDTO } from "./createRoomDTO";
import { Room } from "../../domain/room";
import { ChatUserRepo, RoomRepo } from "../../repos/interfaces";
import { UserProfileDoesNotExistError } from "../createChatUser/createChatUserErrors";
import {
    GetStreamService,
    StreamChannelType,
} from "../../services/getStream/getStreamService";
import {
    ChatUserDoesNotExistError,
    StreamRoomCreationError,
} from "./createRoomErrors";
import { config } from "../../../../lib/config";

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
            chatUser.updateRole("channel_moderator");

            const roomOrError: Result<Room> = Room.create({
                name,
                description,
                createdById: chatUser.userId,
                roomType,
                joiningFee: 0,
                metadata: {},
            });

            if (roomOrError.isFailure && roomOrError.error) {
                return left(new AppError.InputError(roomOrError.error));
            }

            const room = roomOrError.getValue();
            room.addNewMember(chatUser);

            const roomId = room.roomId.id.toString();
            const streamChannel = await this.streamService.createChannel(
                StreamChannelType.Messaging,
                roomId,
                {
                    name: room.name,
                    description,
                    created_by_id: config.getStream.defaultChannelOwnerId,
                    members: [chatUser.userId.id.toString()],
                }
            );

            if (!streamChannel) {
                return left(new StreamRoomCreationError(roomId));
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
