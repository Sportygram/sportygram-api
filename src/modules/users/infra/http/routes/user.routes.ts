import { Router } from "express";
import {
    authMiddleware,
    uploadMiddleware,
} from "../../../../../infra/http/middleware";
import { updateProfileImageController } from "../../../useCases/updateUserProfile";

const userRouter = Router();

userRouter.post(
    "/me/upload",
    authMiddleware.authenticate(),
    uploadMiddleware.uploadProfile(),
    (req, res) => updateProfileImageController.execute(req, res)
);

export { userRouter };