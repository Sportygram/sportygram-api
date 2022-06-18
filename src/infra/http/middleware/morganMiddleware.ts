import morgan from "morgan";
import { IncomingMessage } from "http";
import { stream } from "../../../lib/core/Logger";

export interface MorganRequestWithError extends IncomingMessage {
    error?: Error;
    requestUser?: any;
}

export const errorTokenCallback = (req: MorganRequestWithError, _: any) => {
    return req.error ? req.error.toString() : undefined;
};

export const userIdTokenCallback = (req: MorganRequestWithError, _: any) => {
    return req.requestUser ? req.requestUser.userId : undefined;
};

morgan.token<MorganRequestWithError>("message", errorTokenCallback);
morgan.token<MorganRequestWithError>("user_id", userIdTokenCallback);
// `:remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent" :error`,

export const morganMiddleware = morgan(
    function (tokens, req, res) {
        return tokens["url"](req, res) === "/graphql"
            ? null
            : JSON.stringify({
                  remote_addr: tokens["remote-addr"](req, res),
                  remote_user: tokens["remote-user"](req, res),
                  time: tokens["date"](req, res, "iso"),
                  method: tokens["method"](req, res),
                  url: tokens["url"](req, res),
                  http_version: tokens["http-version"](req, res),
                  status: tokens["status"](req, res),
                  content_length: tokens["res"](req, res, "content-length"),
                  duration: `${tokens["response-time"](req, res)} ms`,
                  referrer: tokens["referrer"](req, res),
                  user_agent: tokens["user-agent"](req, res),
                  message: tokens["message"](req, res),
                  user_id: tokens["user_id"](req, res),
              });
    },
    { stream }
);
