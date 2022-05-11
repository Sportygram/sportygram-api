import { AsyncRedisClient } from "./abstractRedisClient";
import { redisClient } from "./redisClient";

export * from "./redisCache";
export const asyncRedisClient = new AsyncRedisClient(redisClient);
