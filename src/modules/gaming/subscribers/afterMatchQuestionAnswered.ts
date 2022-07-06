// Update and score Match Predictions

import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { ScoreMatchPredictions } from "../useCases/scoreMatchPredictions/scoreMatchPredictions";
import { MatchQuestionAnswered } from "../domain/events/matchQuestionAnswered";

export class AfterMatchQuestionAnswered
    implements IHandle<MatchQuestionAnswered>
{
    constructor(private scoreMatchPredictions: ScoreMatchPredictions) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onLiveMatchUpdated.bind(this) as RegisterCallback,
            MatchQuestionAnswered.name
        );
    }

    private async onLiveMatchUpdated(
        event: MatchQuestionAnswered
    ): Promise<void> {
        const { match } = event;

        try {
            this.scoreMatchPredictions.execute({
                matchId: match.id.toString(),
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
