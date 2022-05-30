import { FieldResolver } from "nexus";
import { ForbiddenError } from "apollo-server-core";
import { userReadRepo } from "../../../iam/repos";

export const viewerResolver: FieldResolver<"Query", "viewer"> = async (
    _parent,
    _args,
    ctx
) => {
    if (!ctx.reqUser) throw new ForbiddenError("Please login to continue");
    const user = await userReadRepo.getUserById(ctx.reqUser.userId);
    if (!user) throw new Error("User fetch Error");
    return user
};
