import { JWTToken, RefreshToken } from "../../domain/valueObjects/jwt";

export interface LoginDTO {
    emailOrUsername: string;
    password: string;
    ip: string;
}

export interface LoginDTOResponse {
    accessToken: JWTToken;
    refreshToken: RefreshToken;
    userId: string;
}
