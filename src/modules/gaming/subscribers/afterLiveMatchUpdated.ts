import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { LiveMatchUpdated } from "../domain/events/liveMatchUpdated";
import { FirebaseService } from "../../../lib/services/firebase";

export class AfterLiveMatchUpdated implements IHandle<LiveMatchUpdated> {
    constructor(private firebaseService: FirebaseService) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onLiveMatchUpdated.bind(this) as RegisterCallback,
            LiveMatchUpdated.name
        );
    }

    private async onLiveMatchUpdated(event: LiveMatchUpdated): Promise<void> {
        const { match, updates } = event;

        try {
            updates.forEach((update) => {
                this.firebaseService.sendToTopic({
                    topic: "all_users",
                    title: update.type,
                    body: `${update.message} happened`,
                    data: update.data,
                });
            });

            logger.info(
                `[AfterLiveMatchUpdated]: Successfully updated user refeerral details after UserReferred`,
                { matchId: match.matchId, updates: updates }
            );
        } catch (err) {
            logger.error(
                `[AfterLiveMatchUpdated]: Failed to updated user referral details after UserReferred.`,
                { matchId: match.matchId, updates: updates }
            );
        }
    }
}
