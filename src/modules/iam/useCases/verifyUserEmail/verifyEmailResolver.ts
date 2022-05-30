import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { UserDoesNotExistError } from "./verifyUserEmailErrors";
import { userReadRepo } from "../../repos";
import { verifyUserEmail } from ".";
import { IAMPermission } from "../../domain/iam.permissions";
import { VerifyUserEmailDTO } from "./verifyUserEmailDTO";

export const verifyEmailResolver: FieldResolver<
    "Mutation",
    "verifyEmail"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser
    } as VerifyUserEmailDTO;
    dto.requestUser.permissions.push(IAMPermission.Me);

    const result = await verifyUserEmail.execute(dto);

    if (result.isRight()) {
        const user = await userReadRepo.getUserById(dto.userId);
        if (!user) throw new Error("User fetch Error");

        return {
            message: "User Email verified",
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
