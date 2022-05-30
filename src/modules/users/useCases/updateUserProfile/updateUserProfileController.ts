import { BaseController } from "../../../../infra/http/models/BaseController";
import { UpdateUserProfile } from "./updateUserProfile";
import express from "express";
import { UpdateUserProfileDTO } from "./updateUserProfileDTO";
import {
    UserDoesNotExistError,
    UserProfileDoesNotExistError,
} from "./updateUserProfileErrors";
import * as AppError from "../../../../lib/core/AppError";
import { UserPermission } from "../../domain/users.permissions";

export class UpdateUserProfileController extends BaseController {
    constructor(private useCase: UpdateUserProfile) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: UpdateUserProfileDTO = req.body as UpdateUserProfileDTO;
        dto.requestUser = requestUser;
        dto.userId = requestUser.userId;
        dto.requestUser.permissions.push(UserPermission.Me);

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                const user = result.value.getValue();

                return this.ok(res, { user }, "User Profile Updated");
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case UserDoesNotExistError:
                    case UserProfileDoesNotExistError:
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
