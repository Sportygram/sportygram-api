import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { FollowUserDTO } from "./followUser.dto";
import { followUser } from ".";
import { UserProfileDoesNotExistError } from "../updateUserProfile/updateUserProfileErrors";

export const followUserResolver: FieldResolver<
    "Mutation",
    "followUser"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        followerId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as FollowUserDTO;

    const result = await followUser.execute(dto);

    if (result.isRight()) {
        return {
            message: "User followed",
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
