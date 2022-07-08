import express from "express";
import cors from "cors";
import helmet from "helmet";
import { v1Router } from "./rest/v1";
import { errorMiddleware } from "./middleware";
import { morganMiddleware } from "./middleware/morganMiddleware";
import { startApolloServer } from "./graphql/server";
import http from "http";

export const app = express();

app.set("PORT", process.env.PORT || 3000);

//#region helmet content security policy setting for loading graphql playground js,css and favicon
const devContentSecurityPolicy = {
    directives: {
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
    },
};
//#endregion

app.use(
    helmet({
        // when undefined it will load the default option: https://github.com/graphql/graphql-playground/issues/1283#issuecomment-723705276
        contentSecurityPolicy:
            process.env.NODE_ENV !== "production"
                ? devContentSecurityPolicy
                : undefined,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(morganMiddleware);

app.get("/", (_req, res) => {
    return res.status(200).send({
        message: "Huddle API",
        status: "success",
        data: { url: "https://api.huddle.io/v1" },
    });
});
app.use("/v1", v1Router);

app.use(errorMiddleware);
export const httpServer = http.createServer(app);

startApolloServer(app, httpServer)
    .then(() => {
        app.use("*", (_req, res) => {
            res.status(404).json({
                message: "URL Not Found",
                status: "error",
                data: null,
            });
        });
    })
    .catch((err) => {
        console.error("SERVER_CRASH: ", err);
        process.exit(1);
    });
