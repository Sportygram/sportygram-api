import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { UpdateChatUserRoleDTO } from "./updateChatUserRoleDTO";
import { roomReadRepo } from "../../repos";
import { updateChatUserRole } from ".";
import {
    ChatUserDoesNotExistError,
    RoomDoesNotExistError,
} from "./updateChatUserRoleErrors";

export const updateChatUserRoleResolver: FieldResolver<
    "Mutation",
    "updateChatUserRole"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as UpdateChatUserRoleDTO;

    const result = await updateChatUserRole.execute(dto);

    if (result.isRight()) {
        const roomId = result.value.getValue().id.toString();
        const room = await roomReadRepo.getRoomById(roomId);
        if (!room) throw new Error("Room fetch Error");

        return {
            message: `User role updated`,
            room,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case ChatUserDoesNotExistError:
            case RoomDoesNotExistError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
