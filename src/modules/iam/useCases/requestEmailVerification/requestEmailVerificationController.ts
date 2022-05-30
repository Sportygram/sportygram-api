import { BaseController } from "../../../../infra/http/models/BaseController";
import { RequestEmailVerification } from "./requestEmailVerification";
import express from "express";
import { RequestEmailVerificationDTO } from "./requestEmailVerificationDTO";
import { UserDoesNotExistError } from "./requestEmailVerificationErrors";
import * as AppError from "../../../../lib/core/AppError";

export class RequestEmailVerificationController extends BaseController {
    constructor(private useCase: RequestEmailVerification) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const requestUser: any = req.requestUser;
        const dto: RequestEmailVerificationDTO =
            req.body as RequestEmailVerificationDTO;
        dto.userId = requestUser.userId;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                // const user = result.value.getValue();
                return this.created(res, {}, "Verification Emaill sent");
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
