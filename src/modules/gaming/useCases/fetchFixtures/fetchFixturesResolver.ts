import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
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

export const predictionResolver: FieldResolver<"Query", "prediction"> = async (
    _parent,
    args,
    ctx
) => {
    if (!ctx.reqUser) throw new ForbiddenError("Please login to continue");
    const match = await matchReadRepo.getMatchByPredictionId(
        args.matchId,
        args.predictionId || undefined
    );

    if (!match) throw new UserInputError("Match not found");
    return match;
};
