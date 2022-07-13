import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { ChatUserRepo } from "../../repos/interfaces";
import { GetStreamService } from "../../services/getStream/getStreamService";
import {
    StreamUserCreationError,
    UserProfileDoesNotExistError,
} from "../createChatUser/createChatUserErrors";
import { get } from "lodash";
import { CreateChatUserDTO } from "../createChatUser/createChatUserDTO";

type Response = Either<
    | StreamUserCreationError
    | UserProfileDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<string>
>;

export class GenerateChatToken
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

            const streamId = chatUser.userId.id.toString();
            const response =
                { [streamId]: await this.streamService.getUserById(streamId) } ||
                (await this.streamService.createOrReplaceUsers([
                    {
                        id: streamId,
                        role: "user",
                        name: chatUser.displayName,
                    },
                ]));
            const streamUser = get(response, streamId);

            if (!streamUser) {
                return left(new StreamUserCreationError(streamId));
            }

            const token = await this.streamService.createToken(streamId);
            chatUser.updateStreamData(streamUser, token);

            await this.chatUserRepo.save(chatUser);

            return right(Result.ok<string>(token));
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
