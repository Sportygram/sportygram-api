import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import { changePassword } from "./";
import * as AppError from "../../../../lib/core/AppError";
import { UserDoesNotExistError } from "./changePasswordErrors";
import { userReadRepo, userRepo } from "../../repos";
import { ChangePasswordDTO } from "./changePasswordDTO";
import { IAMPermission } from "../../domain/iam.permissions";
import { loginUseCase } from "../login";

export const changePasswordResolver: FieldResolver<
    "Mutation",
    "changePassword"
> = async (_parent, args, ctx) => {
    const oldPassword =
        args.oldPassword ||
        (await userRepo
            .getUserByUserId(ctx.reqUser?.userId || '')
            .then((user) => user?.email.value));
    const dto = {
        ...args,
        oldPassword,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as ChangePasswordDTO;
    dto.requestUser.permissions.push(IAMPermission.Me);

    const result = await changePassword.execute(dto);

    if (result.isRight()) {
        const user = await userReadRepo.getUserById(dto.userId);
        if (!user) throw new Error("User fetch Error");

        const loginDto = {
            emailOrUsername: user?.email,
            password: args.newPassword,
            ip: ctx.req.ip,
        };
        const loginResult = await loginUseCase.execute(loginDto);

        if (loginResult.isRight()) {
            const { accessToken, refreshToken } = loginResult.value.getValue();
            return {
                message: "Password changed Successfully",
                accessToken,
                refreshToken,
                user,
            };
        } else {
            const error = loginResult.value;
            throw new Error(error.errorValue().message);
        }
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
