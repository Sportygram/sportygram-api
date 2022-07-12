import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUserMetadata } from "../../messaging/domain/chatUser";
import { UserId } from "../../users/domain/userId";
import { CompetitionId } from "./competitionId";
import { PlayerGameEnded } from "./events/playerGameEnded";
import { GameId } from "./gameId";
import { PlayerGameSummary } from "./gameSummary";
import { PlayerGameSummaries } from "./playerGameSummaries";
import { PlayerId } from "./playerId";

interface PlayerProps {
    userId: UserId;
    username?: string;
    displayName?: string;
    coinBalance: number;
    activeGameSummaries: PlayerGameSummaries;
    metadata: ChatUserMetadata;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Player extends AggregateRoot<PlayerProps> {
    get playerId(): PlayerId {
        return PlayerId.create(this._id).getValue();
    }
    get userId() {
        return this.props.userId;
    }
    get username(): string | undefined {
        return this.props.username;
    }
    get displayName(): string | undefined {
        return this.props.displayName;
    }
    get coinBalance() {
        return this.props.coinBalance;
    }
    get metadata(): ChatUserMetadata {
        return this.props.metadata || { stream: { data: {} } };
    }
    get activeGameSummaries(): PlayerGameSummaries {
        return this.props.activeGameSummaries;
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    public getGameSummariesByCompetition(
        competitionId: CompetitionId
    ): PlayerGameSummary[] {
        return this.props.activeGameSummaries
            .getItems()
            .filter((gs) => gs.competitionId.equals(competitionId));
    }

    public addActiveGameSummary(gameSummary: PlayerGameSummary): Result<void> {
        const foundGameSummaries = this.getGameSummariesByCompetition(
            gameSummary.competitionId
        );
        if (foundGameSummaries.find((gs) => gs.type === gameSummary.type))
            return Result.fail(
                `Game with competitionId: ${gameSummary.competitionId.id} and type ${gameSummary.type} exists`
            );
        this.props.activeGameSummaries.add(gameSummary);
        return Result.ok();
    }

    public setGameSummaryComplete(gameId: GameId): Result<void> {
        const gameSummary = this.props.activeGameSummaries
            .getItems()
            .find((gs) => gs.gameId.equals(gameId));

        if (!gameSummary) return Result.fail("Game summary for gameId not found");
        if (gameSummary.isComplete())
            return Result.fail("Game is already complete");

        gameSummary.completeGame();

        this.props.activeGameSummaries.remove(gameSummary);
        this.addDomainEvent(new PlayerGameEnded(this, gameSummary));
        return Result.ok();
    }

    public updateCompetitonGameScores(
        competitionId: CompetitionId,
        points: number
    ): Result<void> {
        const competitonGameSummaries =
            this.getGameSummariesByCompetition(competitionId);

        competitonGameSummaries.forEach((gs) => {
            gs.increaseScore(points);
            this.props.activeGameSummaries.add(gs);
        });
        return Result.ok();
    }

    private constructor(roleProps: PlayerProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static create(
        props: PlayerProps,
        id?: UniqueEntityID
    ): Result<Player> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.coinBalance, argumentName: "coinBalance" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Player>(guardResult.message || "");
        }

        const chatUser = new Player({ ...props }, id);

        return Result.ok<Player>(chatUser);
    }
}
