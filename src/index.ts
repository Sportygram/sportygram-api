// Env
import * as dotenv from "dotenv";
dotenv.config();

import logger from "./lib/core/Logger";

// Infra
import { app } from "./infra/http/app";
import "./infra/socket";

// Workers
import "./modules/gaming/workers";

// Subscriptions
import "./modules/users/subscribers";
import "./modules/iam/subscribers";
import "./modules/messaging/subscribers";
import "./modules/gaming/subscribers";

app.listen(app.get("PORT"), () =>
    logger.info(`🚀 Server running on port ${app.get("PORT")}`, {
        port: app.get("PORT"),
    })
);
