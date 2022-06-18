import { Request } from "express";
import { RequestUserDTO } from "../../../lib/utils/permissions";
import { authMiddleware } from "../middleware";

export interface Context {
    req: Request;
    reqUser?: RequestUserDTO;
    reqLogInfo?: any
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
    const reqUser = await authMiddleware.getRequestUserFromAuthHeader(req);

    return {
        req,
        reqUser,
    };
};
