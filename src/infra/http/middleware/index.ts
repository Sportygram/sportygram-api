import { NextFunction, Request, Response } from "express";
// import { firebaseService } from "../../../lib/services/firebase";
import { authService } from "../../../modules/iam/services";
import { fetchRequestUser } from "../../../modules/iam/useCases/fetchRequestUser";
import { HttpException } from "../models/HTTPException";
import { AuthMiddleware } from "./authMiddleware";
import { UploadMiddleware } from "./uploadMiddleware";

export const authMiddleware = new AuthMiddleware(
    authService,
    // firebaseService,
    fetchRequestUser
);
export const uploadMiddleware = new UploadMiddleware();

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
