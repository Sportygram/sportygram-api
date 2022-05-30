import { BaseController } from "../../../../infra/http/models/BaseController";
import { RefreshAccessToken } from "./RefreshAccessToken";
import { RefreshAccessTokenDTO } from "./RefreshAccessTokenDTO";
import * as RefreshAccessTokenErrors from "./RefreshAccessTokenErrors";
import { LoginDTOResponse } from "../login/loginDTO";
import * as express from "express";

export class RefreshAccessTokenController extends BaseController {
    private useCase: RefreshAccessToken;

    constructor(useCase: RefreshAccessToken) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const dto: RefreshAccessTokenDTO = req.body as RefreshAccessTokenDTO;
        dto.ip = req.ip;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case RefreshAccessTokenErrors.RefreshTokenNotFound:
                        return this.notFound(res, error.errorValue().message);
                    case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
                        return this.notFound(res, error.errorValue().message);
                    default:
                        return this.fail(res, error.errorValue().message, req);
                }
            } else {
                const resultDto: LoginDTOResponse = result.value.getValue();
                return this.ok<LoginDTOResponse>(
                    res,
                    resultDto,
                    "New Auth Token Generated"
                );
            }
        } catch (err) {
            return this.fail(res, err, req);
        }
    }
}
