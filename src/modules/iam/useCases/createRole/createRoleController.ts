import { BaseController } from "../../../../infra/http/models/BaseController";
import { CreateRole } from "./createRole";
import express from "express";
import { CreateRoleDTO } from "./createRoleDTO";
import { RoleAlreadyExistsError } from "./createRoleErrors";
import * as AppError from "../../../../lib/core/AppError";
import { RoleMap } from "../../mappers/roleMap";

export class CreateRoleController extends BaseController {
    constructor(private useCase: CreateRole) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: CreateRoleDTO = req.body as CreateRoleDTO;
        dto.requestUser = requestUser;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                const role = result.value.getValue();
                return this.created(
                    res,
                    { role: RoleMap.toDTO(role) },
                    "Role Created"
                );
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case RoleAlreadyExistsError:
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
