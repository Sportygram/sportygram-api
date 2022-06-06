import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { ChatUserRepo } from "../../repos/interfaces";
import { CreateChatUserDTO } from "./createChatUserDTO";
import { GetStreamService } from "../../services/getStream/getStreamService";
import {
    StreamUserCreationError,
    UserProfileDoesNotExistError,
} from "./createChatUserErrors";
import { ChatUser } from "../../domain/chatUser";
import { get } from "lodash";

type Response = Either<
    | UserProfileDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<ChatUser>
>;

export class CreateChatUser
    implements UseCase<CreateChatUserDTO, Promise<Response>>
{
    constructor(
        private chatUserRepo: ChatUserRepo,
        private streamService: GetStreamService
    ) {}

    async execute(request: CreateChatUserDTO): Promise<Response> {
        const { userId } = request;

        try {
            const chatUser = await this.chatUserRepo.getChatUserByUserId(
                userId
            );

            if (!chatUser) {
                return left(new UserProfileDoesNotExistError(userId));
            }

            const streamId = chatUser.chatUserId.id.toString();
            const response = await this.streamService.createOrReplaceUsers([{
                id: streamId,
                role: "user",
            }]);
            const streamUser = get(response, streamId);

            if (!streamUser) {
                return left(new StreamUserCreationError(streamId));
            }

            const token = await this.streamService.createToken(streamId);
            chatUser.updateStreamData(streamUser, token);

            await this.chatUserRepo.save(chatUser);

            return right(Result.ok<ChatUser>(chatUser));
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
