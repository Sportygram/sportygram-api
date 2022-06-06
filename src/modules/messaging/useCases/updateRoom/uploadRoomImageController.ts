import { BaseController } from "../../../../infra/http/models/BaseController";
import { UpdateRoom } from "./updateRoom";
import express from "express";
import { UpdateRoomDTO } from "./updateRoomDTO";
import { RoomDoesNotExistError } from "./updateRoomErrors";
import * as AppError from "../../../../lib/core/AppError";
import { MessagingPermission } from "../../domain/messaging.permissions";

export class UpdateRoomImageController extends BaseController {
    constructor(private useCase: UpdateRoom) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const file = req.file as any;
        if (!file) {
            return this.clientError(
                res,
                "No file uploaded, Please upload a file",
                req
            );
        }

        const dto: UpdateRoomDTO = {
            roomId: req.params.roomId,
            roomImageUrl: file?.url,
        } as UpdateRoomDTO;
        dto.requestUser = requestUser;
        dto.requestUser.permissions.push(MessagingPermission.Me);

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                const user = result.value.getValue();

                return this.ok(res, { user }, "Room Image Updated");
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case RoomDoesNotExistError:
                        return this.notFound(res, error.errorValue().message);
                    case AppError.InputError:
                        return this.clientError(
                            res,
                            error.errorValue().message,
                            req
                        );
                    case AppError.PermissionsError:
                        return this.forbidden(res, error.errorValue().message);
                    default:
                        return this.fail(res, error.errorValue().message, req);
                }
            }
        } catch (error) {
            return this.fail(res, error, req);
        }
    }
}
