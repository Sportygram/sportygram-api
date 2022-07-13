import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { UnfollowUserDTO } from "./unfollowUser.dto";
import { unfollowUser } from ".";
import { UserProfileDoesNotExistError } from "../updateUserProfile/updateUserProfileErrors";

export const unfollowUserResolver: FieldResolver<
    "Mutation",
    "unfollowUser"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        followerId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as UnfollowUserDTO;

    const result = await unfollowUser.execute(dto);

    if (result.isRight()) {
        return {
            message: "User Unfollowed",
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case UserProfileDoesNotExistError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
