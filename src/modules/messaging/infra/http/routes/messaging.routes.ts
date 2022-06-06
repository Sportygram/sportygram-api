import { Router } from "express";
import {
    authMiddleware,
    uploadMiddleware,
} from "../../../../../infra/http/middleware";
import { updateRoomImageController } from "../../../useCases/updateRoom";

const roomRouter = Router();

roomRouter.post(
    "/:roomId/upload",
    authMiddleware.authenticate(),
    uploadMiddleware.uploadProfile({ keyType: "room" }),
    (req, res) => updateRoomImageController.execute(req, res)
);

export { roomRouter };
