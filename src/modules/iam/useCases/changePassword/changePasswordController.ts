import { BaseController } from "../../../../infra/http/models/BaseController";
import { ChangePassword } from "./changePassword";
import express from "express";
import { ChangePasswordDTO } from "./changePasswordDTO";
import { UserDoesNotExistError } from "./changePasswordErrors";
import * as AppError from "../../../../lib/core/AppError";
import { IAMPermission } from "../../domain/iam.permissions";

export class ChangePasswordController extends BaseController {
    constructor(private useCase: ChangePassword) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: ChangePasswordDTO = req.body as ChangePasswordDTO;
        dto.requestUser = requestUser;
        dto.userId = requestUser.userId;
        dto.requestUser.permissions.push(IAMPermission.Me);

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                // const user = result.value.getValue();
                return this.created(res, {}, "Password changed Successfully");
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case UserDoesNotExistError:
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
