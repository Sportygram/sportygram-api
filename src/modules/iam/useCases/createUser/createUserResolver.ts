import { FieldResolver } from "nexus";
import { UserInputError } from "apollo-server-core";
import { config } from "../../../../lib/config";
import { createUser } from "./";
import { defaultRequestUser } from "./createUserDTO";
import * as AppError from "../../../../lib/core/AppError";
import * as RegisterUserErrors from "./createUserErrors";
import { userReadRepo } from "../../repos";
import { loginUseCase } from "../login";

export const createUserResolver: FieldResolver<"Mutation", "signup"> = async (
    _parent,
    args,
    ctx
) => {
    const sgConfig = config.huddle;
    const dto = {
        ...args,
        password: args.password || args.email,
        referralCode: args.referralCode || undefined,
        role: sgConfig.defaultUserRole,
        requestUser: defaultRequestUser,
        sendVerificationMail: false,
        sendPasswordResetMail: false,
    };

    const result = await createUser.execute(dto);

    args.password = "";
    ctx.reqLogInfo.variables = JSON.stringify(args);

    if (result.isRight()) {
        const createdUser = result.value.getValue();
        const user = await userReadRepo.getUserById(
            createdUser.userId.id.toString()
        );
        if (!user) throw new Error("User fetch Error");

        const loginDto = {
            emailOrUsername: user?.email,
            password: args.password || args.email,
            ip: ctx.req.ip,
        };
        const loginResult = await loginUseCase.execute(loginDto);

        if (loginResult.isRight()) {
            const { accessToken, refreshToken } = loginResult.value.getValue();
            return {
                message: "User Account created",
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
            case RegisterUserErrors.EmailAlreadyExistsError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
