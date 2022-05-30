import { JWTToken, RefreshToken } from "../domain/valueObjects/jwt";
import { User } from "../domain/user";
import { JWTClaims, RequestUserDTO } from "../../../lib/utils/permissions";

export interface AuthService {
    signJWT(props: JWTClaims): JWTToken;
    decodeJWT(token: string): Promise<JWTClaims | undefined>;
    createRefreshToken(): RefreshToken;
    getTokens(email: string): Promise<string[]>;
    saveAuthenticatedUser(
        user: User,
        accessToken: string,
        refreshToken: RefreshToken
    ): Promise<void>;
    deAuthenticateUser(userId: string): Promise<void>;
    refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
    getUserIdFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
    cacheUserPermissions(requestUser: RequestUserDTO): Promise<void>;
    deleteCachedUserPermissions(userId: string): Promise<void>;
    getCachedUserPermissions(
        userId: string
    ): Promise<RequestUserDTO | undefined>;
}
