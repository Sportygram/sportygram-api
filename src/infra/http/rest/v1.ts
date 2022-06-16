import express from "express";
import swaggerUi from "swagger-ui-express";
import { roomRouter } from "../../../modules/messaging/infra/http/routes/messaging.routes";
import { userRouter } from "../../../modules/users/infra/http/routes/user.routes";
import swaggerDocument from "./swagger.json";

export const v1Router = express.Router();

v1Router.get("/", (_req, res) => {
    return res.status(200).send({
        message: "Huddle API",
        status: "success",
        data: { message: "Huddle API version 1" },
    });
});

v1Router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

v1Router.use("/users", userRouter);
v1Router.use("/rooms", roomRouter);
