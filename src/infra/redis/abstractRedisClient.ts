import { RedisClient } from "redis";
import { promisify } from "util";

export class AsyncRedisClient {
    private tokenExpiryTime = 604800; // All keys expire after a week
    protected client: RedisClient;

    constructor(client: RedisClient) {
        this.client = client;
    }

    public async count(key: string): Promise<number> {
        const allKeys = await this.getAllKeys(key);
        return allKeys.length;
    }

    public exists(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return this.count(key)
                .then((count) => {
                    return resolve(count >= 1 ? true : false);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    // public getOne<T>(key: string): Promise<T> {
    //     return new Promise((resolve, reject) => {
    //         this.client.get(key, (error: Error | null, reply: unknown) => {
    //             if (error) {
    //                 return reject(error);
    //             } else {
    //                 return resolve(<T>reply);
    //             }
    //         });
    //     });
    // }

    public getOne(key: string) {
        return promisify(this.client.get).bind(this.client)(key);
    }

    public getAllKeys(wildcard: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.client.keys(
                wildcard,
                async (error: Error | null, results: string[]) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(results);
                    }
                }
            );
        });
    }

    public getAllKeyValue(wildcard: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.client.keys(
                wildcard,
                async (error: Error | null, results: string[]) => {
                    if (error) {
                        return reject(error);
                    } else {
                        const allResults = await Promise.all(
                            results.map(async (key) => {
                                const value = await this.getOne(key);
                                return { key, value };
                            })
                        );
                        return resolve(allResults);
                    }
                }
            );
        });
    }

    public set(key: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (error, reply) => {
                if (error) {
                    return reject(error);
                } else {
                    this.client.expire(key, this.tokenExpiryTime);
                    return resolve(reply);
                }
            });
        });
    }

    /**
     * Save Key to redis with timeout; timeout defaults to 1week
     * @param key
     * @param value
     * @param timeout timeout in seconds, default to 604800 (1week)
     */
    public setex(key: string, value: any, timeout = 604800): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (error, reply) => {
                if (error) {
                    return reject(error);
                } else {
                    this.client.expire(key, timeout);
                    return resolve(reply);
                }
            });
        });
    }

    public deleteOne(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.client.del(key, (error, reply) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(reply);
                }
            });
        });
    }

    public testConnection(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.set("test", "connected", (err) => {
                if (err) {
                    reject();
                } else {
                    resolve(true);
                }
            });
        });
    }
}
