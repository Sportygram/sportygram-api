import redis from "redis";
import { config } from "../../config";
import logger from "../../lib/core/Logger";

const { url } = config.redis;
const redisClient = redis.createClient(url);

redisClient.on("connect", function () {
    logger.info(`[Redis]: Connected to redis server at ${url}`);
});

redisClient.on("error", function (err: Error) {
    logger.error("[Redis]", { message: err.message });
});

export { redisClient };
