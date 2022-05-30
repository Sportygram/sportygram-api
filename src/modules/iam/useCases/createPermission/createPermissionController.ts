import { BaseController } from "../../../../infra/http/models/BaseController";
import { CreatePermission } from "./createPermission";
import express from "express";
import { CreatePermissionDTO } from "./createPermissionDTO";
import { PermissionAlreadyExistsError } from "./createPermissionErrors";
import * as AppError from "../../../../lib/core/AppError";
import { PermissionMap } from "../../mappers/permissionMap";

export class CreatePermissionController extends BaseController {
    constructor(private useCase: CreatePermission) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: CreatePermissionDTO = req.body as CreatePermissionDTO;
        dto.requestUser = requestUser;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                const permission = result.value.getValue();
                return this.created(
                    res,
                    { role: PermissionMap.toDTO(permission) },
                    "Permission Created"
                );
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case PermissionAlreadyExistsError:
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
