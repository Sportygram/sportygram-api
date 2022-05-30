import { BaseController } from "../../../../infra/http/models/BaseController";
import { DeleteUser } from "./deleteUser";
import express from "express";
import { DeleteUserDTO } from "./deleteUserDTO";
import {
    UserIdDoesntExistError,
    PasswordDoesntMatchError,
} from "./deleteUserErrors";
import * as AppError from "../../../../lib/core/AppError";
import { IAMPermission } from "../../domain/iam.permissions";

export class DeleteUserController extends BaseController {
    constructor(private useCase: DeleteUser) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: DeleteUserDTO = {
            userId: req.params.userId,
            requestUser: requestUser,
            ...req.body,
        } as DeleteUserDTO;

        dto.requestUser.permissions.push(IAMPermission.Me);

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                return this.ok(res, {}, "User Deleted");
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case AppError.PermissionsError:
                        return this.forbidden(res);
                    case AppError.InputError:
                    case UserIdDoesntExistError:
                    case PasswordDoesntMatchError:
                        return this.clientError(
                            res,
                            error.errorValue().message,
                            req
                        );
                    default:
                        return this.fail(res, error.errorValue().message, req);
                }
            }
        } catch (error) {
            return this.fail(res, error, req);
        }
    }
}
