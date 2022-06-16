import { AuthenticationError } from "apollo-server-core";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../../modules/iam/services/authService";
import { FirebaseService } from "../../../lib/services/firebase";
import { FetchRequestUser } from "../../../modules/iam/useCases/fetchRequestUser/fetchRequestUser";

function getJWTFromBearerToken(token: string): string {
    return token.split(" ")[1];
}

type TokenSource = "firebase" | "huddle_auth";

export class AuthMiddleware {
    constructor(
        private authService: AuthService,
        private firebaseService: FirebaseService,
        private fetchRequestUserByUserId: FetchRequestUser
    ) {}

    private endRequest(
        res: Response,
        message: string,
        status: 401 | 500 | 403
    ) {
        return res.status(status).json({ message });
    }

    authenticate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            // Get jwt from Auth Header
            const token = getJWTFromBearerToken(
                req.headers["authorization"] || ""
            );

            // See if the token was found
            if (!token) {
                return this.endRequest(res, "No access token provided", 403);
            }

            let tokenSource: TokenSource = "firebase";
            let decoded;

            decoded = await this.firebaseService.decodeToken(token);
            if (!decoded) {
                decoded = await this.authService.decodeToken(token);
                tokenSource = "huddle_auth";
            }
            // Confirm that the token was signed with our signature.
            if (!decoded) {
                return this.endRequest(res, "Token signature expired.", 401);
            }

            const { userId } = decoded;

            if (tokenSource === "huddle_auth") {
                const tokens = await this.authService.getTokens(userId);
                // if the token was found, just continue the request.
                if (!tokens.length) {
                    return this.endRequest(
                        res,
                        "Auth token not found. User is probably not logged in. Please login again.",
                        403
                    );
                }
            }
            // If Token, Get full User Details
            const result = await this.fetchRequestUserByUserId.execute(decoded);
            if (result.isRight()) {
                const requestUser = result.value.getValue();
                req.requestUser = requestUser;
                return next();
            } else {
                return this.endRequest(res, "Error Authenticating", 500);
            }
        };
    }

    async getRequestUserFromAuthHeader(req: Request) {
        // Get jwt from Auth Header
        const token = getJWTFromBearerToken(req.headers["authorization"] || "");
        if (!token) return;

        let tokenSource: TokenSource = "firebase";
        let decoded;

        decoded = await this.firebaseService.decodeToken(token);
        if (!decoded) {
            decoded = await this.authService.decodeToken(token);
            tokenSource = "huddle_auth";
        }
        if (!decoded) return;

        // See if the token was found
        const { userId } = decoded;

        if (tokenSource === "huddle_auth") {
            const tokens = await this.authService.getTokens(userId);
            // if the token was found, just continue the request.
            if (!tokens.length) {
                throw new AuthenticationError(
                    "Auth token not found. User is probably not logged in. Please login again."
                );
            }
        }

        // If Token, Get full User Details
        const result = await this.fetchRequestUserByUserId.execute(decoded);
        if (result.isRight()) {
            const requestUser = result.value.getValue();
            return requestUser;
        } else {
            throw new Error("Error Authenticating");
        }
    }
}
