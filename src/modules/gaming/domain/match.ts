import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { LeagueId } from "./leagueId";
import { MatchId } from "./matchId";
import { MatchStatus, Sport, Team } from "./types";
import { MatchQuestions } from "./valueObjects/matchQuestions";

interface MatchProps {
    teams: Team[];
    sport: string;
    status: string;
    dateTime: Date;
    periods: Record<string, string>;
    season: string;
    leagueId: LeagueId;
    venue: string;
    winner?: string;
    summary: Record<string, any>;
    sources: Record<string, any>;
    questions: MatchQuestions; // store only solutions
    metadata: Record<string, any>; // home: "MUN", away: "CHE", periodNames(could be in code)
    createdAt?: Date;
    updatedAt?: Date;
}

export class Match extends AggregateRoot<MatchProps> {
    get matchId(): MatchId {
        return MatchId.create(this._id).getValue();
    }

    get teams(): Team[] {
        return this.props.teams;
    }
    get sport(): Sport {
        return this.props.sport as Sport;
    }
    get status(): MatchStatus {
        return this.props.status as MatchStatus;
    }
    get dateTime(): Date {
        return this.props.dateTime;
    }
    get periods() {
        return this.props.periods;
    }
    get season() {
        return this.props.season;
    }
    get leagueId() {
        return this.props.leagueId;
    }
    get venue() {
        return this.props.venue;
    }
    get winner() {
        return this.props.winner;
    }
    get summary() {
        return this.props.summary;
    }
    get sources() {
        return this.props.sources;
    }
    get metadata() {
        return this.props.metadata;
    }
    get questions(): MatchQuestions {
        return this.props.questions;
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    private constructor(roleProps: MatchProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static create(
        props: MatchProps,
        id?: UniqueEntityID
    ): Result<Match> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.sport, argumentName: "sport" },
            { argument: props.status, argumentName: "status" },
            { argument: props.dateTime, argumentName: "dateTime" },
            { argument: props.periods, argumentName: "periods" },
            { argument: props.season, argumentName: "season" },
            { argument: props.summary, argumentName: "summary" },
            { argument: props.sources, argumentName: "sources" },
            { argument: props.questions, argumentName: "questions" },
            { argument: props.metadata, argumentName: "metadata" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Match>(guardResult.message || "");
        }

        const match = new Match(props, id);
        // const isNewMatch = !id;

        // if (isNewMatch) {
        //     match.addDomainEvent(new MatchCreated(match));
        // }
        return Result.ok<Match>(match);
    }
}
