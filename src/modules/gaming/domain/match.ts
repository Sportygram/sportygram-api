import { isEqual } from "lodash";
import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { LiveMatchUpdated } from "./events/liveMatchUpdated";
import { CompetitionId } from "./competitionId";
import { MatchId } from "./matchId";
import {
    FootballPeriod,
    Summary,
    Sources,
    MatchStatus,
    MatchMetadata,
    MatchEventData,
    Sport,
    Team,
    Goal,
    MatchQuestion,
    FootballQuestion,
    MatchQuestionsMap,
} from "./types";
import { MatchQuestions } from "./valueObjects/matchQuestions";
import { isConstObjectType } from "../../../lib/utils/typeUtils";

interface MatchProps {
    teams: Team[];
    sport: string;
    status: string;
    dateTime: Date;
    periods: Record<Partial<FootballPeriod>, string>;
    season: string;
    competitionId: CompetitionId;
    venue: string;
    winner?: string;
    summary: Summary;
    sources: Sources;
    questions: MatchQuestions; // store only solutions
    metadata: MatchMetadata; // periodNames(could be in code)
    createdAt?: Date;
    updatedAt?: Date;
}

export class Match extends AggregateRoot<MatchProps> {
    get matchId(): MatchId {
        return MatchId.create(this._id).getValue();
    }

    get name(): string {
        const teams = this.metadata.teams;
        return `${teams.home.code} vs ${teams.away.code}`;
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
    get periods(): Record<Partial<FootballPeriod>, string> {
        return this.props.periods;
    }
    get season() {
        return this.props.season;
    }
    get competitionId() {
        return this.props.competitionId;
    }
    get venue() {
        return this.props.venue;
    }
    get winner() {
        return this.props.winner;
    }
    get summary(): Summary {
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

    public updateMatchStatus(status: string): Result<void> {
        const isValidStatus = isConstObjectType<MatchStatus>(
            status,
            MatchStatus
        );

        if (!isValidStatus) {
            return Result.fail("Invalid match status");
        }

        this.props.status = status;
        return Result.ok()
    }

    private updateScores(goal: Goal): MatchEventData[] {
        const events: MatchEventData[] = [];

        const oldScores = this.props.summary.scores;
        const homeOrAway =
            goal.teamCode === this.metadata.teams.home.code ? "home" : "away";

        if (goal.goal > oldScores[goal.teamCode]) {
            events.push({
                type: "goal",
                message: `${this.metadata.teams[homeOrAway].name} scored`,
                data: {
                    teamCode: goal.teamCode,
                    homeOrAway,
                    player: goal.scorer?.name,
                    score: goal.goal,
                    minute: goal.minute,
                },
            });

            // update scores
            this.props.summary.scores[goal.teamCode] = goal.goal;

            // update goals
            if (this.props.summary.goals) {
                if (!this.props.summary.goals[goal.teamCode])
                    this.props.summary.goals[goal.teamCode] = [];

                this.props.summary.goals[goal.teamCode].push(goal);
            } else {
                this.props.summary.goals = { [goal.teamCode]: [goal] };
            }
        }

        return events;
    }

    private updateMatchProps(data: Partial<MatchProps>): MatchEventData[] {
        // updated props [
        //    summary.scores, summary.goals, (goal)
        //    periods, summary.scoresByPeriodEnd, (period_completed / break started)
        //    winner, summary.statistics, (completed)
        //    status, metadata.status (kickoff, completed)
        // ]
        // matchUpdates [
        //   "kickoff","goal","penalty","substitution",
        //   "red_card","period_complete", "period_started", "completed",
        // ]
        let events: MatchEventData[] = [];

        const homeCode = this.metadata.teams.home.code;
        const awayCode = this.metadata.teams.away.code;

        if (
            data.summary?.scores &&
            !isEqual(data.summary.scores, this.props.summary.scores)
        ) {
            const newScores = data.summary.scores;
            const oldScores = this.props.summary.scores;

            let teamCode;
            if (newScores[homeCode] > oldScores[homeCode]) teamCode = homeCode;
            else teamCode = awayCode;

            const goal: Goal = {
                teamCode,
                goal: newScores[teamCode],
            };
            events = [...events, ...this.updateScores(goal)];
        }

        if (data.periods)
            this.props.periods = { ...this.props.periods, ...data.periods };
        if (data.summary?.scoresByPeriodEnd)
            this.props.summary.scoresByPeriodEnd = {
                ...this.props.summary.scoresByPeriodEnd,
                ...data.summary.scoresByPeriodEnd,
            };

        if (data.winner) this.props.winner = data.winner;
        if (data.summary?.statistics)
            this.props.summary.statistics = data.summary.statistics;

        if (data.metadata?.status) {
            this.props.metadata.status = data.metadata.status;
        }

        if (data.status && data.status !== this.status) {
            if (
                this.status === MatchStatus.Scheduled &&
                data.status === MatchStatus.InProgress
            ) {
                events.push({
                    type: "kickoff",
                    message: "Match Started",
                    data: {},
                });
            }

            if (
                this.status === MatchStatus.InProgress &&
                data.status === MatchStatus.Completed
            ) {
                events.push({
                    type: "completed",
                    message: "Match ended",
                    data: {
                        scores: this.summary.scores,
                    },
                });
            }

            this.props.status = data.status;
        }
        return events;
    }

    public updateLiveMatch(data: Partial<MatchProps>): Result<void> {
        const events = this.updateMatchProps(data);
        this.addDomainEvent(new LiveMatchUpdated(this, events));
        return Result.ok();
    }

    public completeMatch(data: Partial<MatchProps>): Result<void> {
        // TODO: Solve questions and add solutions and if truly complete
        // You can make this public and specifically call it to add a MatchCompleted event
        // that will later update the match and answer questions
        // This is most advisable if properly answering the questions has an external dependency

        // Check all data required to complete a match and answer questions
        const events = this.updateMatchProps(data);
        // solve questions here or dispatch a MatchCompleted event that will handle
        this.addDomainEvent(new LiveMatchUpdated(this, events));
        return Result.ok();
    }

    public getQuestionsWithOptions(): Result<MatchQuestion[]> {
        try {
            const teamCodes = this.teams.map((t) => ({
                value: t.code,
                display: t.name,
            }));

            const questions = Object.assign({}, MatchQuestionsMap);
            questions[FootballQuestion.Winner].options = [
                ...teamCodes,
                { value: "DRAW", display: "DRAW" },
            ];
            questions[FootballQuestion.FirstToScore].options = teamCodes;
            questions[FootballQuestion.ManOfTheMatch].options = this.teams
                .map((t) => {
                    if (!t.athletes) throw new Error("Athletes not loaded");
                    return t.athletes.map((a) => ({
                        value: `${a.id}`,
                        display: `${a.id}`,
                    }));
                })
                .flat();

            questions[FootballQuestion.BothTeamsScore].options = [
                { value: "true", display: "true" },
                { value: "false", display: "false" },
            ];

            return Result.ok(Object.values(questions));
        } catch (e) {
            return Result.fail(e);
        }
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

        const isValidStatus = isConstObjectType<MatchStatus>(
            props.status,
            MatchStatus
        );

        if (!isValidStatus) {
            return Result.fail<Match>("Invalid match status");
        }

        const match = new Match(props, id);
        // const isNewMatch = !id;

        // if (isNewMatch) {
        //     match.addDomainEvent(new MatchCreated(match));
        // }
        return Result.ok<Match>(match);
    }
}
