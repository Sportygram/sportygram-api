import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { MatchCompleted } from "../domain/events/matchCompleted";
import { CompleteFootballMatch } from "../useCases/completeMatch/completeFootballMatch";

export class AfterMatchCompleted implements IHandle<MatchCompleted> {
    constructor(private completeMatch: CompleteFootballMatch) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onUMatchCompleted.bind(this) as RegisterCallback,
            MatchCompleted.name
        );
    }

    private async onUMatchCompleted(event: MatchCompleted): Promise<void> {
        const { match } = event;

        try {
            const result = await this.completeMatch.execute({
                matchId: match.id.toString(),
            });

            if (result.isLeft()) {
                const completeError = result.value.error;
                const message =
                    typeof completeError === "string"
                        ? completeError
                        : completeError?.message;

                throw new Error(message);
            }
            logger.info(
                `[AfterMatchCompleted]: Successfully executed CompleteMatch use case AfterMatchCompleted`,
                {
                    matchId: match.id.toString(),
                }
            );
        } catch (err) {
            logger.error(`[AfterMatchCompleted]: ${err.message}`, {
                matchId: match.id.toString(),
            });
        }
    }
}
