import { NextFunction, Request, Response } from "express";
import { HttpException } from "../models/HTTPException";




export function errorMiddleware(
    err: HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    res.status(err.status || 500).json({
        message: err.message || "Unexpected Error",
        status: "error",
        data: null,
    });
}