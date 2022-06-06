import { FieldResolver } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import * as AppError from "../../../../lib/core/AppError";
import { updateRoom } from ".";
import { MessagingPermission } from "../../domain/messaging.permissions";
import { UpdateRoomDTO } from "./updateRoomDTO";
import { RoomDoesNotExistError } from "./updateRoomErrors";

export const updateRoomResolver: FieldResolver<
    "Mutation",
    "updateRoom"
> = async (_parent, args, ctx) => {
    const dto = {
        ...args.input,
        requestUser: ctx.reqUser,
    } as UpdateRoomDTO;
    dto.requestUser.permissions.push(MessagingPermission.Me);
    const result = await updateRoom.execute(dto);

    if (result.isRight()) {
        const room = result.value.getValue();

        return {
            message: "Room Updated",
            room,
        };
    } else {
        const error = result.value;

        switch (error.constructor) {
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
