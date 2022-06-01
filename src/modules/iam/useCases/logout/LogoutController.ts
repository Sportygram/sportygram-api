import { BaseController } from "../../../../infra/http/models/BaseController";
import { LogoutUseCase } from "./LogoutUseCase";
import * as express from "express";
import { LogoutDTO } from "./LogoutDTO";

export class LogoutController extends BaseController {
    private useCase: LogoutUseCase;

    constructor(useCase: LogoutUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<any> {
        const dto = { userId: req.requestUser?.userId } as LogoutDTO;

        try {
            const result = await this.useCase.execute(dto);

            if (result.isRight()) {
                return this.ok(res, {}, "Logout Successful");
            } else {
                return this.fail(res, result.value.errorValue().message, req);
            }
        } catch (err) {
            return this.fail(res, err, req);
        }
    }
}
