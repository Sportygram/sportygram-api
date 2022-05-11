import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
// import { iamRouter } from "../../modules/iam/infra/http/routes/iam.routes";

export const v1Router = express.Router();

v1Router.get("/", (_req, res) => {
    return res.status(200).send({
        message: "Sportygram API",
        status: "success",
        data: { message: "Sportygram API version 1" },
    });
});

v1Router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// v1Router.use("/users", iamRouter);
