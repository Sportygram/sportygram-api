import { initializeApp, App } from "firebase-admin/app";
import { getAuth, Auth, UserRecord } from "firebase-admin/auth";
import logger from "../../core/Logger";
import { JWTClaims } from "../../utils/permissions";

export class FirebaseService {
    private app: App;
    private auth: Auth;

    constructor() {
        this.app = initializeApp();
        this.auth = getAuth(this.app);
    }

    async getUserFromIdToken(token: string): Promise<UserRecord | undefined> {
        try {
            const decoded = await this.auth.verifyIdToken(token);
            const user = await this.auth.getUser(decoded.uid);
            return user;
        } catch (error) {
            logger.error("[Firebase Auth Error]", { error });
            return undefined;
        }
    }

    async setClaims(uid: string, data: Object) {
        try {
            await this.auth.setCustomUserClaims(uid, data);
        } catch (error) {
            logger.error("[Firebase Auth Error]", { error });
        }
    }

    async decodeToken(token: string): Promise<JWTClaims | undefined> {
        try {
            const decoded = await this.auth.verifyIdToken(token);
            if (!decoded.uuid) throw { message: "missing uuid", decoded };

            const claims = {
                userId: decoded.userId,
                roles: [],
                state: decoded.state,
            };
            return claims;
        } catch (error) {
            logger.error("[Firebase Auth Error]", { error });
            return undefined;
        }
    }
}
