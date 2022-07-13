import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { RemoveUserFromRoomDTO } from "./removeUserFromRoom.dto";
import { roomReadRepo } from "../../repos";
import { removeUserFromRoom } from ".";
import {
    ChatUserDoesNotExistError,
    RoomDoesNotExistError,
    StreamRoomUpdateError,
} from "../addUserToRoom/addUserToRoomErrors";

export const removeUserFromRoomResolver: FieldResolver<
    "Mutation",
    "leaveRoom"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as RemoveUserFromRoomDTO;

    const result = await removeUserFromRoom.execute(dto);

    if (result.isRight()) {
        const room = await roomReadRepo.getRoomById(dto.roomId);
        if (!room) throw new Error("Room fetch Error");

        return {
            message: "User Removed From Room",
            room,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
            case ChatUserDoesNotExistError:
            case RoomDoesNotExistError:
            case StreamRoomUpdateError:
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
