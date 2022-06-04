import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { UserDoesNotExistError } from "./verifyUserEmailErrors";
import { userReadRepo } from "../../repos";
import { verifyUserEmail } from ".";
import { VerifyUserEmailDTO } from "./verifyUserEmailDTO";
import { sleep } from "../../../../lib/utils/sleep";

export const verifyEmailResolver: FieldResolver<
    "Mutation",
    "verifyEmail"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        userId: ctx.reqUser?.userId,
    } as VerifyUserEmailDTO;

    const result = await verifyUserEmail.execute(dto);

    if (result.isRight()) {
        await sleep(500);
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
