import { JWTToken, RefreshToken } from "../../domain/valueObjects/jwt";
import { AuthService } from "../authService";
import { User } from "../../domain/user";
import jwt from "jsonwebtoken";
import randtoken from "rand-token";
import { AsyncRedisClient } from "../../../../infra/redis/abstractRedisClient";
import { JWTClaims, RequestUserDTO } from "../../../../lib/utils/permissions";
import { config } from "../../../../lib/config";
const authConfig: any = config.auth;

export class RedisAuthService implements AuthService {
    public jwtHashName = "activeJwtClients";
    constructor(private redisClient: AsyncRedisClient) {}

    private getRequestUserCacheKey(userId: string) {
        return `requestUser:${userId}`;
    }

    async cacheUserPermissions(requestUser: RequestUserDTO): Promise<void> {
        const key = this.getRequestUserCacheKey(requestUser.userId);
        this.redisClient.setex(key, JSON.stringify(requestUser), 900);
    }

    async deleteCachedUserPermissions(userId: string): Promise<void> {
        const key = this.getRequestUserCacheKey(userId);
        this.redisClient.deleteOne(key);
    }

    async getCachedUserPermissions(
        userId: string
    ): Promise<RequestUserDTO | undefined> {
        const key = this.getRequestUserCacheKey(userId);
        const cachedRequestUser = await this.redisClient.getOne(key);
        let requestUser;
        if (cachedRequestUser) {
            requestUser = (await JSON.parse(
                cachedRequestUser
            )) as RequestUserDTO;
        }
        return requestUser;
    }

    public async saveAuthenticatedUser(
        user: User,
        accessToken: JWTToken,
        refreshToken: RefreshToken
    ): Promise<void> {
        await this.addToken(
            user.userId.id.toString(),
            refreshToken,
            accessToken
        );
    }

    constructKey(userId: string, refreshToken: string): string {
        return `refresh-${refreshToken}.${this.jwtHashName}.${userId}`;
    }

    async deAuthenticateUser(userId: string): Promise<void> {
        await this.clearAllSessions(userId);
    }

    async refreshTokenExists(refreshToken: RefreshToken): Promise<boolean> {
        const keys = await this.redisClient.getAllKeys(`*${refreshToken}*`);
        return keys.length !== 0;
    }

    async getUserIdFromRefreshToken(refreshToken: string): Promise<string> {
        const keys = await this.redisClient.getAllKeys(`*${refreshToken}*`);
        const exists = keys.length !== 0;

        if (!exists) throw new Error("UserId not found for refresh token.");

        const key = keys[0];

        return key.substring(
            key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1
        );
    }

    /**
     * @method countTokens
     * @desc Counts the total number of sessions for a particular user.
     * @return Promise<number>
     */
    public countTokens(): Promise<number> {
        return this.redisClient.count(`*${this.jwtHashName}*`);
    }

    /**
     * Fetch all of a user's active tokens
     * @param userId
     */
    async getTokens(userId: string): Promise<string[]> {
        const keyValues = await this.redisClient.getAllKeyValue(
            `*${this.jwtHashName}.${userId}`
        );
        return keyValues.map((kv) => kv.value);
    }

    signJWT(props: JWTClaims): string {
        const claims: JWTClaims = {
            userId: props.userId,
            roles: props.roles,
            state: props.state,
        };
        return jwt.sign(claims, authConfig.secret);
    }

    decodeJWT(token: string): Promise<JWTClaims | undefined> {
        return new Promise((resolve) => {
            jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
                if (err) return resolve(undefined);
                return resolve(decoded);
            });
        });
    }

    createRefreshToken(): string {
        return randtoken.uid(256);
    }

    /**
     * @method addToken
     * @desc Adds the token for this user to redis.
     *
     * @param {userId} string
     * @param {refreshToken} string
     * @param {token} string
     * @return Promise<any>
     */

    public async addToken(
        userId: string,
        refreshToken: RefreshToken,
        token: JWTToken
    ): Promise<any> {
        return this.redisClient.setex(
            this.constructKey(userId, refreshToken),
            token,
            authConfig.refreshTokenExpiresInSeconds
        );
    }

    /**
     * @method clearAllTokens
     * @desc Clears all jwt tokens from redis. Usually useful for testing.
     * @return Promise<any>
     */

    public async clearAllTokens(): Promise<any> {
        const allKeys = await this.redisClient.getAllKeys(
            `*${this.jwtHashName}*`
        );
        return Promise.all(
            allKeys.map((key) => this.redisClient.deleteOne(key))
        );
    }

    /**
     * @method countSessions
     * @desc Counts the total number of sessions for a particular user.
     * @param {userId} string
     * @return Promise<number>
     */

    public countSessions(userId: string): Promise<number> {
        return this.redisClient.count(`*${this.jwtHashName}.${userId}`);
    }

    /**
     * @method getToken
     * @desc Gets a single token for the user.
     * @param {userId} string
     * @param {refreshToken} string
     * @return Promise<string>
     */
    public async getToken(
        userId: string,
        refreshToken: string
    ): Promise<string | null> {
        return this.redisClient.getOne(this.constructKey(userId, refreshToken));
    }

    /**
     * @method clearToken
     * @desc Deletes a single user's session token.
     * @param {userId} string
     * @param {refreshToken} string
     * @return Promise<string>
     */
    public async clearToken(
        userId: string,
        refreshToken: string
    ): Promise<any> {
        return this.redisClient.deleteOne(
            this.constructKey(userId, refreshToken)
        );
    }

    /**
     * @method clearAllSessions
     * @desc Clears all active sessions for the current user.
     * @param {userId} string
     * @return Promise<any>
     */
    public async clearAllSessions(userId: string): Promise<any> {
        const keyValues = await this.redisClient.getAllKeyValue(
            `*${this.jwtHashName}.${userId}`
        );
        const keys = keyValues.map((kv) => kv.key);
        return Promise.all(keys.map((key) => this.redisClient.deleteOne(key)));
    }

    /**
     * @method sessionExists
     * @desc Checks if the session for this user exists
     * @param {userId} string
     * @param {refreshToken} string
     * @return Promise<boolean>
     */
    public async sessionExists(
        userId: string,
        refreshToken: string
    ): Promise<boolean> {
        const token = await this.getToken(userId, refreshToken);
        if (!!token) {
            return true;
        } else {
            return false;
        }
    }
}
