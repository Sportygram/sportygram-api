import { asyncRedisClient } from ".";
import flatten from "flat";

export function redisCache(f: (...args: any[]) => any) {
    return function memoize(...args: any[]) {
        return async function (timeoutSecs = 604800, keyPrefix = "") {
            const keyArr = Object.values<any>(flatten<any, any>(args));
            const key = `${keyPrefix}_${f.name}_${keyArr.join("_")}`;
            const cachedResult: string | null = await asyncRedisClient.getOne(
                key
            );
            if (cachedResult) return JSON.parse(cachedResult);

            const result = await f(...args);
            await asyncRedisClient.setex(
                key,
                JSON.stringify(result),
                timeoutSecs
            );
            return result;
        };
    };
}
