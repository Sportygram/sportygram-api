import { BaseController } from "../../../../infra/http/models/BaseController";
import { LoginUseCase } from "./login";
import express from "express";
import { LoginDTO, LoginDTOResponse } from "./loginDTO";
import * as LoginUseCaseErrors from "./loginErrors";
import * as AppError from "../../../../lib/core/AppError";

export class LoginController extends BaseController {
    constructor(private useCase: LoginUseCase) {
        super();
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const dto: LoginDTO = req.body as LoginDTO;
        dto.ip = req.ip;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                const resultDto: LoginDTOResponse = result.value.getValue();
                return this.ok<LoginDTOResponse>(
                    res,
                    resultDto,
                    "Auth Token Created"
                );
            } else {
                const error = result.value;

                switch (error.constructor) {
                    case LoginUseCaseErrors.EmailDoesntExistError:
                        return this.notFound(res, error.errorValue().message);
                    case LoginUseCaseErrors.PasswordDoesntMatchError:
                    case AppError.InputError:
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
