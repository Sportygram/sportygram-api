import { FieldResolver } from "nexus";
import { userRepo } from "../../repos";

export const checkUsernameResolver: FieldResolver<
    "Mutation",
    "checkUsername"
> = async (_parent, args, _ctx) => {
    const user = await userRepo.getUserByUsername(args.username);
    const available = !user;
    return {
        available,
        message: `Username is ${available ? "" : "not"} available`,
    };
};
