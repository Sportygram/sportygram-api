import { BaseController } from "../../../../infra/http/models/BaseController";
import { ResetPassword } from "./resetPassword";
import express from "express";
import { ResetPasswordDTO } from "./resetPasswordDTO";
import { UserDoesNotExistError } from "./resetPasswordErrors";
import * as AppError from "../../../../lib/core/AppError";

export class ResetPasswordController extends BaseController {
    constructor(private useCase: ResetPassword) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const dto: ResetPasswordDTO = req.body as ResetPasswordDTO;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                return this.created(res, {}, "Password reset Successfully");
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
