import { BaseController } from "../../../../infra/http/models/BaseController";
import { AssignPermissionToRole } from "./assignPermissionToRole";
import express from "express";
import { AssignPermissionToRoleDTO } from "./assignPermissionToRoleDTO";
import {
    PermissionDoesNotExistError,
    RoleDoesNotExistError,
} from "./assignPermissionToRoleErrors";
import * as AppError from "../../../../lib/core/AppError";
import { RoleMap } from "../../mappers/roleMap";

export class AssignPermissionToRoleController extends BaseController {
    constructor(private useCase: AssignPermissionToRole) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: AssignPermissionToRoleDTO =
            req.body as AssignPermissionToRoleDTO;
        dto.roleId = req.params.roleId;
        dto.requestUser = requestUser;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                const role = result.value.getValue();
                return this.ok(
                    res,
                    { role: RoleMap.toDTO(role) },
                    "Permission Assigned To Role"
                );
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case RoleDoesNotExistError:
                        return this.notFound(res, error.errorValue().message);
                    case PermissionDoesNotExistError:
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
