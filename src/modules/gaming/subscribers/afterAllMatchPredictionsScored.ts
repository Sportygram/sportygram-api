// Update and score Match Predictions

import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { AllMatchPredictionsScored } from "../domain/events/allMatchPredictionsScored";
import { UpdateRoomGameLeaderboards } from "../useCases/updateRoomGameLeaderboards/updateRoomGameLeaderboards";

export class AfterAllMatchPredictionsScored
    implements IHandle<AllMatchPredictionsScored>
{
    constructor(
        private updateRoomGameLeaderboards: UpdateRoomGameLeaderboards
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onLiveMatchUpdated.bind(this) as RegisterCallback,
            AllMatchPredictionsScored.name
        );
    }

    private async onLiveMatchUpdated(
        event: AllMatchPredictionsScored
    ): Promise<void> {
        const { match } = event;

        try {
            this.updateRoomGameLeaderboards.execute({
                competitionId: match.competitionId.id.toString(),
            });

            logger.info(
                `[AfterMatchQuestionAnswered]: Successfully updated user refeerral details after UserReferred`,
                { matchId: match.matchId }
            );
        } catch (err) {
            logger.error(
                `[AfterMatchQuestionAnswered]: Failed to updated user referral details after UserReferred.`,
                { matchId: match.matchId }
            );
        }
    }
}
