import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { SystemRequestUser } from "../../../lib/utils/permissions";
import { FCMTokenUpdated } from "../domain/events/fcmTokenUpdated";
import { UpdateUserFCMTopics } from "../useCases/updateUserFCMTopics/updateUserFCMTopics";
import { FCMTopic } from "../../../lib/services/firebase";

export class AfterFCMTokenUpdated implements IHandle<FCMTokenUpdated> {
    constructor(private updateUserFCMTopics: UpdateUserFCMTopics) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onFCMTokenUpdated.bind(this) as RegisterCallback,
            FCMTokenUpdated.name
        );
    }

    private async onFCMTokenUpdated(event: FCMTokenUpdated): Promise<void> {
        const { user } = event;

        try {
            await Promise.all([
                this.updateUserFCMTopics.execute({
                    userId: user.userId.id.toString(),
                    set: FCMTopic.AllUsers,
                    requestUser: SystemRequestUser,
                }),
            ]);

            logger.info(
                `[AfterFCMTokenUpdated]: Successfully added user to ${FCMTopic.AllUsers} after FCMTokenUpdated`,
                { userId: user.userId, token: user.metadata.fcm?.token }
            );
        } catch (err) {
            logger.error(
                `[AfterFCMTokenUpdated]: Failed to add user to ${FCMTopic.AllUsers} after FCMTokenUpdated.`,
                { userId: user.userId, token: user.metadata.fcm?.token }
            );
        }
    }
}
