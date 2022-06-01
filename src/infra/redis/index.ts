import { redisClient } from "./redisClient";
import { AsyncRedisClient } from "./abstractRedisClient";

export * from "./redisCache";
export const asyncRedisClient = new AsyncRedisClient(redisClient);
