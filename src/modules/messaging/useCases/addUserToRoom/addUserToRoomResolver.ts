import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { AddUserToRoomDTO } from "./addUserToRoomDTO";
import { roomReadRepo } from "../../repos";
import { addUserToRoom } from ".";
import {
    ChatUserDoesNotExistError,
    RoomDoesNotExistError,
    StreamRoomUpdateError,
} from "./addUserToRoomErrors";

export const addUserToRoomResolver: FieldResolver<"Mutation", "joinRoom"> = async (
    _parent,
    args,
    ctx
) => {
    const dto = {
        ...args,
        userId: ctx.reqUser?.userId,
        requestUser: ctx.reqUser,
    } as AddUserToRoomDTO;

    const result = await addUserToRoom.execute(dto);

    if (result.isRight()) {
        const roomId = result.value.getValue().id.toString();
        const room = await roomReadRepo.getRoomById(roomId);
        if (!room) throw new Error("Room fetch Error");

        return {
            message: "Chat Room Created",
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
