import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { updateUserProfile } from ".";
import { UserPermission } from "../../domain/users.permissions";
import { UpdateUserProfileDTO } from "./updateUserProfileDTO";
import {
    UserDoesNotExistError,
    UserProfileDoesNotExistError,
} from "./updateUserProfileErrors";

export const syncFCMTokenResolver: FieldResolver<
    "Mutation",
    "syncFCMToken"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as UpdateUserProfileDTO;
    dto.requestUser.permissions.push(UserPermission.Me);

    const result = await updateUserProfile.execute(dto);

    if (result.isRight()) {
        const user = result.value.getValue();

        return {
            message: "User Updated",
            user,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case UserDoesNotExistError:
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
