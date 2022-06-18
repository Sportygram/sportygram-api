import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { EmailDoesntExistError, PasswordDoesntMatchError } from "./loginErrors";
import { userReadRepo } from "../../repos";
import { loginUseCase } from "../login";
import { LoginDTO } from "./loginDTO";

export const loginResolver: FieldResolver<"Mutation", "login"> = async (
    _parent,
    args,
    ctx
) => {
    const dto = {
        ...args.input,
    } as LoginDTO;
    const result = await loginUseCase.execute(dto);

    args.input.password = "";
    ctx.reqLogInfo.variables = JSON.stringify(args);

    if (result.isRight()) {
        const { accessToken, refreshToken, userId } = result.value.getValue();
        const user = await userReadRepo.getUserById(userId);
        if (!user) throw new Error("User fetch Error");

        return {
            message: "User Authentication token created",
            accessToken,
            refreshToken,
            user,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case EmailDoesntExistError:
            case PasswordDoesntMatchError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
