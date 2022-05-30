import { BaseController } from "../../../../infra/http/models/BaseController";
import { RequestPasswordChange } from "./requestPasswordChange";
import express from "express";
import { RequestPasswordChangeDTO } from "./requestPasswordChangeDTO";
import { UserDoesNotExistError } from "./requestPasswordChangeErrors";
import * as AppError from "../../../../lib/core/AppError";

export class RequestPasswordChangeController extends BaseController {
    constructor(private useCase: RequestPasswordChange) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const dto: RequestPasswordChangeDTO =
            req.body as RequestPasswordChangeDTO;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                // const user = result.value.getValue();
                return this.created(res, {}, "Password Reset Email sent");
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
