import { Request } from "express";
import logger from "../../../lib/core/Logger";
import { RequestUserDTO } from "../../../lib/utils/permissions";
import { authMiddleware } from "../middleware";

export interface Context {
    req: Request;
    reqUser?: RequestUserDTO;
    reqLogInfo?: any;
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
    let reqUser;
    try {
        reqUser = await authMiddleware.getRequestUserFromAuthHeader(req);
    } catch (error) {
        logger.error("Auth_Error", error);
    }

    return {
        req,
        reqUser,
    };
};
