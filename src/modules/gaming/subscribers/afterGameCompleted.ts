import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { GameCompleted } from "../domain/events/gameCompleted";
import { CreateGame } from "../useCases/createGame/createGame";
import dayjs from "dayjs";
import { GameType } from "../domain/types";

export class AfterGameCompleted implements IHandle<GameCompleted> {
    constructor(private createGame: CreateGame) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onUserCreated.bind(this) as RegisterCallback,
            GameCompleted.name
        );
    }

    private async onUserCreated(event: GameCompleted): Promise<void> {
        const { game } = event;

        try {
            const expiryIncr = game.type === GameType.Weekly ? "week" : "year";

            const player = await this.createGame.execute({
                name: game.name,
                description: game.description,
                competitionId: game.competitionId.toString(),
                type: game.type,
                expiringAt: dayjs(game.expiringAt)
                    .add(1, expiryIncr)
                    .startOf("week")
                    .add(1, "day")
                    .toISOString(),
            });

            if (player.isLeft()) {
                const playerError = player.value.error;
                const message =
                    typeof playerError === "string"
                        ? playerError
                        : playerError?.message;

                throw new Error(message);
            }
            logger.info(
                `[AfterGameCompleted]: Successfully executed CreatePlayer use case AfterGameCompleted`,
                {
                    gameId: game.gameId,
                }
            );
        } catch (err) {
            logger.error(`[AfterGameCompleted]: ${err.message}`, {
                gameId: game.gameId,
            });
        }
    }
}
