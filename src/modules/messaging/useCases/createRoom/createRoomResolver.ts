import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { CreateRoomDTO } from "./createRoomDTO";
import { roomReadRepo } from "../../repos";
import { createRoom } from ".";
import { ChatUserDoesNotExistError } from "./createRoomErrors";

export const createRoomResolver: FieldResolver<
    "Mutation",
    "createRoom"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args,
        roomType: args?.roomType || "public",
        createdBy: ctx.reqUser?.userId,
        requestUser: ctx.reqUser
    } as CreateRoomDTO;

    const result = await createRoom.execute(dto);

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
            case AppError.InputError:
                throw new UserInputError(error.errorValue().message);
            case AppError.PermissionsError:
                throw new ForbiddenError(error.errorValue().message);
            default:
                throw new Error(error.errorValue().message);
        }
    }
};
