import { initializeApp, App, ServiceAccount, cert } from "firebase-admin/app";
import { getAuth, Auth, UserRecord } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import { config } from "../../config";
import logger from "../../core/Logger";
import { JWTClaims } from "../../utils/permissions";

const serviceAccount = config.firebase.serviceAccount as ServiceAccount;

export const FCMTopic = {
    AllUsers: "all_users",
} as const;
export type FCMTopic = typeof FCMTopic[keyof typeof FCMTopic];

export class FirebaseService {
    private app: App;
    private auth: Auth;

    constructor() {
        this.app = initializeApp({
            credential: cert(serviceAccount),
        });
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
            logger.error("[Firebase Auth Error]", { message: error.message });
            return undefined;
        }
    }

    /* Notifications 
        Client sends fcm token on app initial load, maybe after a login
        token is saved to db with the time
        Client will periodocally (maybe monthly) send the token and resubscribe to topics
            Maybe server could handle subscription and resubscription to topics
        Server would unsubscribe clients that have been inactive for months from topics
            (faster fanouts cos fewer stale tokens and better success metrics tracking)
        
    */

    private async sendNotification(message: any) {
        try {
            getMessaging().send(message);
            // console.log("Successfully sent message:", response);
            return true;
        } catch (error) {
            logger.error("[Firebase Messaging Notify Error]:", {
                error,
                message,
            });
            return false;
        }
    }
    async sendToDevice(
        fcmToken: string,
        title: string,
        body: string,
        data: any,
        options: any
    ) {
        const message = {
            notification: {
                title,
                body,
                color: options.color || config.huddle.defaultProfileColour,
            },
            data,
            token: fcmToken,
        };
        this.sendNotification(message);
    }
    async sendToTopic(
        topic: FCMTopic,
        title: string,
        body: string,
        data: any,
        options: any
    ) {
        const message = {
            notification: {
                title,
                body,
                color: options.color || config.huddle.defaultProfileColour,
            },
            data,
            topic,
        };
        this.sendNotification(message);
    }
    async subscribeDeviceToTopic(fcmToken: string, topic: FCMTopic) {
        try {
            getMessaging().subscribeToTopic([fcmToken], topic);
            // See the MessagingTopicManagementResponse reference documentation
            // for the contents of response.
            // console.log("Successfully subscribed to topic:", response);
            return true;
        } catch (error) {
            logger.error("[Firebase Messaging Subscribe Error]:", {
                error,
                fcmToken,
                topic,
            });
            return false;
        }
    }
    async unsubscribeDeviceFromTopic(fcmToken: string, topic: FCMTopic) {
        try {
            getMessaging().unsubscribeFromTopic([fcmToken], topic);
            return true;
            // See the MessagingTopicManagementResponse reference documentation
            // for the contents of response.
            // console.log("Successfully unsubscribed from topic:", response);
        } catch (error) {
            logger.error("[Firebase Messaging Unsubscribe Error]:", {
                error,
                fcmToken,
                topic,
            });
            return false;
        }
    }
}
