import { FieldResolver } from "nexus";
import { ForbiddenError } from "apollo-server-core";
import { matchReadRepo } from "../../repos";

export const fixturesResolver: FieldResolver<"Query", "fixtures"> = async (
    _parent,
    args,
    ctx
) => {
    if (!ctx.reqUser) throw new ForbiddenError("Please login to continue");
    const matches = await matchReadRepo.getMatchesByDate(
        ctx.reqUser.userId,
        args.date || undefined,
        args.live || false
    );
    return matches;
};
