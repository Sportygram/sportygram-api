import { asyncRedisClient } from "../../../infra/redis";
import { RedisAuthService } from "./redis/redisAuthService";

const authService = new RedisAuthService(asyncRedisClient);

export { authService };
