import { BaseController } from "../../../../infra/http/models/BaseController";
import { AssignRoleToUser } from "./assignRoleToUser";
import express from "express";
import { AssignRoleToUserDTO } from "./assignRoleToUserDTO";
import {
    RoleDoesNotExistError,
    UserDoesNotExistError,
} from "./assignRoleToUserErrors";
import * as AppError from "../../../../lib/core/AppError";

export class AssignRoleToUserController extends BaseController {
    constructor(private useCase: AssignRoleToUser) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: AssignRoleToUserDTO = req.body as AssignRoleToUserDTO;
        dto.userId = req.params.userId;
        dto.requestUser = requestUser;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                // const user = result.value.getValue();
                return this.created(res, {}, "Role Assigned to User");
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case UserDoesNotExistError:
                        return this.notFound(res, error.errorValue().message);
                    case RoleDoesNotExistError:
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
