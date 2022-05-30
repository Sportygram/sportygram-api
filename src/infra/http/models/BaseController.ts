import * as express from "express";
import { Pagination } from "../../../lib/@types";
import logger from "../../../lib/core/Logger";

export abstract class BaseController {
    protected abstract executeImpl(
        req: express.Request,
        res: express.Response
    ): Promise<void | any>;

    public async execute(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            await this.executeImpl(req, res);
        } catch (err) {
            logger.error(`[BaseController]: Uncaught controller error`, {
                err,
            });
            this.fail(res, "An unexpected error occurred", req);
        }
    }

    public static jsonResponse(
        res: express.Response,
        code: number,
        message: string
    ) {
        return res.status(code).json({ message });
    }

    public ok<T>(
        res: express.Response,
        data: T,
        message: string,
        pagination?: Pagination
    ) {
        if (pagination)
            pagination = {
                ...pagination,
                pages: Math.floor(pagination.total / pagination.perPage) + 1,
            };
        return res.status(200).json({ message, data, pagination });
    }

    public created<T>(res: express.Response, data: T, message = "Created") {
        return res.status(201).json({ message, data });
    }

    public clientError(
        res: express.Response,
        message?: string,
        req?: express.Request
    ) {
        if (req && message) req.error = new Error(message);
        return BaseController.jsonResponse(
            res,
            400,
            message ? message : "Bad Request"
        );
    }

    public unauthorized(res: express.Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            401,
            message ? message : "Unauthorized"
        );
    }

    public paymentRequired(
        res: express.Response,
        message?: string,
        req?: express.Request
    ) {
        if (req && message) req.error = new Error(message);
        return BaseController.jsonResponse(
            res,
            402,
            message ? message : "Payment required"
        );
    }

    public forbidden(res: express.Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            403,
            message ? message : "Forbidden"
        );
    }

    public notFound(res: express.Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            404,
            message ? message : "Not found"
        );
    }

    public conflict(res: express.Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            409,
            message ? message : "Conflict"
        );
    }

    public tooMany(res: express.Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            429,
            message ? message : "Too many requests"
        );
    }

    public todo(res: express.Response) {
        return BaseController.jsonResponse(res, 400, "TODO");
    }

    public fail(
        res: express.Response,
        error: Error | string,
        req: express.Request
    ) {
        req.error = typeof error === "string" ? new Error(error) : error;

        return res.status(500).json({
            message: error.toString(),
        });
    }
}
