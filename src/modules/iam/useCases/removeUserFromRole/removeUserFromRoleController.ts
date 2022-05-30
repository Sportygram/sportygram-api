import { BaseController } from "../../../../infra/http/models/BaseController";
import { RemoveUserFromRole } from "./removeUserFromRole";
import express from "express";
import { RemoveUserFromRoleDTO } from "./removeUserFromRoleDTO";
import {
    RoleDoesNotExistError,
    UserDoesNotExistError,
} from "./removeUserFromRoleErrors";
import * as AppError from "../../../../lib/core/AppError";

export class RemoveUserFromRoleController extends BaseController {
    constructor(private useCase: RemoveUserFromRole) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: RemoveUserFromRoleDTO = req.body as RemoveUserFromRoleDTO;
        dto.userId = req.params.userId;
        dto.requestUser = requestUser;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                // const user = result.value.getValue();
                return this.created(res, {}, "User Removed from Role");
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case RoleDoesNotExistError:
                    case UserDoesNotExistError:
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
