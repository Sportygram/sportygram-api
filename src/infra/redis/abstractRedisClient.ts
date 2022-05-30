import { redisClient as client } from "./redisClient";

export class AsyncRedisClient {
    private tokenExpiryTime = 604800; // All keys expire after a week

    constructor() {}

    public async count(key: string): Promise<number> {
        const allKeys = await this.getAllKeys(key);
        return allKeys.length;
    }

    public async exists(key: string): Promise<boolean> {
        const count = await this.count(key);
        return count >= 1 ? true : false;
    }

    public async getOne(key: string) {
        return client.get(key);
    }

    public async getAllKeys(wildcard: string): Promise<string[]> {
        return client.keys(wildcard);
    }

    public async getAllKeyValue(wildcard: string): Promise<any[]> {
        const results = await client.keys(wildcard);
        const allResults = await Promise.all(
            results.map(async (key) => {
                const value = await this.getOne(key);
                return { key, value };
            })
        );
        return allResults;
    }

    public async set(key: string, value: any): Promise<any> {
        const reply = await client.set(key, value);
        client.expire(key, this.tokenExpiryTime);
        return reply;
    }

    /**
     * Save Key to redis with timeout; timeout defaults to 1week
     * @param key
     * @param value
     * @param timeout timeout in seconds, default to 604800 (1week)
     */
    public async setex(key: string, value: any, timeout = 604800): Promise<any> {
        const reply = await client.set(key, value);
        client.expire(key, timeout);
        return reply;
    }

    public async deleteOne(key: string): Promise<number> {
        return client.del(key);
    }

    public async testConnection(): Promise<any> {
        return client.set("test", "connected");
    }
}
