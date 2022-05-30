import { RefreshToken } from "../../domain/valueObjects/jwt";

export interface RefreshAccessTokenDTO {
    refreshToken: RefreshToken;
    ip: string;
}
