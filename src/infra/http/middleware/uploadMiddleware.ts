import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { HttpException } from "../models/HTTPException";
import S3Storage from "./multerS3";

export class UploadMiddleware {
    private endRequest(
        res: Response,
        message: string,
        status: 401 | 500 | 403
    ) {
        return res.status(status).json({ message });
    }

    uploadProfile() {
        return (req: Request, res: Response, next: NextFunction) => {
            // Upload Image
            if (!req.requestUser?.userId)
                return this.endRequest(
                    res,
                    "User authentication required",
                    500
                );
            const key = `users/${req.requestUser.userId}/avatar`;

            return multer({
                storage: S3Storage({ key }),
                fileFilter: function fileFilter(_req, file, cb) {
                    const imageTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                    ];

                    if (!imageTypes.includes(file.mimetype)) {
                        cb(
                            new HttpException(
                                400,
                                "Uploaded picture must be a valid image"
                            )
                        );
                    } else cb(null, true);
                },
                limits: {
                    fileSize: 10000000, // 10mb
                },
            }).single("profileImage")(req, res, next);
        };
    }
}
