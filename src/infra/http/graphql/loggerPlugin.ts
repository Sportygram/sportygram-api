import { v4 as uuid } from "uuid";
import logger from "../../../lib/core/Logger";

export const loggerPlugin = {
    async requestDidStart(ctx: any) {
        ctx.context.reqLogInfo = {
            requestId: uuid(),
            query: ctx.request.query?.replace(/\s+/g, " ").trim(),
            started: new Date(),
            variables: JSON.stringify(ctx.request.variables),
            operationName: ctx.request.operationName,
        };
        return {
            async willSendResponse(ctx: any) {
                if (!ctx.errors?.length)
                    ctx.logger.info(
                        `[${ctx.context.reqLogInfo.operationName}] success`,
                        { reqLogInfo: ctx.context.reqLogInfo }
                    );
            },

            async didEncounterErrors(ctx: any) {
                ctx.errors.forEach((error: any) =>
                    logger.warn(
                        `[${ctx.context.reqLogInfo.operationName}] failed`,
                        {
                            error,
                            reqLogInfo: ctx.context.reqLogInfo,
                        }
                    )
                );
            },
        };
    },
};
