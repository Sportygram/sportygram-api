import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { UserDoesNotExistError } from "./resetPasswordErrors";
import { userReadRepo } from "../../repos";
import { resetPassword } from ".";
import { ResetPasswordDTO } from "./resetPasswordDTO";

export const resetPasswordResolver: FieldResolver<
    "Mutation",
    "resetPassword"
> = async (_parent, args, _ctx) => {
    const dto = args as ResetPasswordDTO;

    const result = await resetPassword.execute(dto);

    if (result.isRight()) {
        const user = await userReadRepo.getUserById(dto.userId);
        if (!user) throw new Error("User fetch Error");

        return {
            message: "User Password Reset",
            accessToken: null,
            refreshToken: null,
            user,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case UserDoesNotExistError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
