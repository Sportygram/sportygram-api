import { ForbiddenError } from "apollo-server-errors";
import { FieldResolver } from "nexus";
import { userReadRepo } from "../../../iam/repos";
import { streamService } from "../../services/getStream";

export const chatTokenResolver: FieldResolver<"Query", "chatToken"> = async (
    _parent,
    _args,
    ctx
) => {
    if (!ctx.reqUser) throw new ForbiddenError("Please login to continue");
    const user = await userReadRepo.getUserById(ctx.reqUser.userId);
    if (!user || !user.chatData) throw new Error("User fetch Error");

    // TODO: Move into usecase and save new token generated
    const token = await streamService.createToken(user.chatData.streamUserId);
    if (!token) throw new Error("Token generate Error");
    return token;
};
