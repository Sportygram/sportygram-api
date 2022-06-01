import { FieldResolver } from "nexus";
import { UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { userReadRepo } from "../../repos";
import { createUserWithFirebaseToken } from ".";
import { SyncFirebaseUserDTO } from "./syncFirebaseUserDTO";
import { EmailAlreadyExistsError } from "../createUser/createUserErrors";

export const syncFirebaseUserResolver: FieldResolver<
    "Mutation",
    "syncFirebaseUser"
> = async (_parent, args, _ctx) => {
    const dto = {
        ...args,
    } as SyncFirebaseUserDTO;

    const result = await createUserWithFirebaseToken.execute(dto);

    if (result.isRight()) {
        const createdUser = result.value.getValue();
        const user = await userReadRepo.getUserById(
            createdUser.userId.id.toString()
        );
        if (!user) throw new Error("User fetch Error");

        return {
            message: "User Account created",
            accessToken: null,
            refreshToken: null,
            user,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case EmailAlreadyExistsError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
