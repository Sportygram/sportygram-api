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
    MatchQuestionCode,
} from "./types";
import { MatchQuestions } from "./valueObjects/matchQuestions";
import { isConstObjectType } from "../../../lib/utils/typeUtils";
import { MatchQuestionAnswered } from "./events/matchQuestionAnswered";
import { MatchCompleted } from "./events/matchCompleted";
import { AllMatchPredictionsScored } from "./events/allMatchPredictionsScored";

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
    private questionAnswered: boolean;

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
        return Result.ok();
    }

    /** Update summary.scores, summary.goals and return goal event */
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

            // update goals
            if (this.props.summary.goals) {
                if (!this.props.summary.goals[goal.teamCode])
                    this.props.summary.goals[goal.teamCode] = [];

                this.props.summary.goals[goal.teamCode].push(goal);
            } else {
                this.props.summary.goals = { [goal.teamCode]: [goal] };
            }

            // set first_to_score question solution
            this.solveQuestion(FootballQuestion.FirstToScore, goal.teamCode);
        }

        return events;
    }

    /*
        matchUpdates [
            "kickoff","goal","penalty","substitution",
            "red_card","period_complete", "period_started", "completed",
        ]
    */
    private updateMatchProps(data: Partial<MatchProps>): MatchEventData[] {
        let events: MatchEventData[] = [];

        const homeCode = this.metadata.teams.home.code;
        const awayCode = this.metadata.teams.away.code;

        // update summary.scores, summary.goals, (goal)
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

            // update scores
            this.props.summary.scores = data.summary.scores;

            if (newScores[homeCode] && newScores[awayCode]) {
                this.solveQuestion(FootballQuestion.BothTeamsScore, true);
            }
        }

        // update periods, summary.scoresByPeriodEnd, (period_completed / break started)
        if (data.periods)
            this.props.periods = { ...this.props.periods, ...data.periods };
        if (data.summary?.scoresByPeriodEnd)
            this.props.summary.scoresByPeriodEnd = {
                ...this.props.summary.scoresByPeriodEnd,
                ...data.summary.scoresByPeriodEnd,
            };

        // update winner, summary.statistics, (completed)
        if (data.winner && !this.winner) {
            this.props.winner = data.winner;
            this.solveQuestion(FootballQuestion.Winner, data.winner);
        }
        if (data.summary?.statistics)
            this.props.summary.statistics = data.summary.statistics;

        // update status, metadata.status (kickoff, completed)
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

    private solveQuestion(questionCode: MatchQuestionCode, solution: any) {
        this.questions.solveQuestion(questionCode, solution);

        if (!this.questionAnswered) {
            this.addDomainEvent(new MatchQuestionAnswered(this));
            this.questionAnswered = true;
        }
    }

    public updateLiveMatch(data: Partial<MatchProps>): Result<void> {
        const events = this.updateMatchProps(data);
        this.addDomainEvent(new LiveMatchUpdated(this, events));

        if (this.status === MatchStatus.Completed) {
            this.addDomainEvent(new MatchCompleted(this));
        }
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

    public allQuestionsAnswered(): boolean {
        for (let question of this.questions.value) {
            if (!question.solution) return false;
        }
        return true;
    }

    public setAllPredictionsScored() {
        this.props.metadata.allMatchPredictionsScored = true;
        this.addDomainEvent(new AllMatchPredictionsScored(this));
    }
    private constructor(roleProps: MatchProps, id?: UniqueEntityID) {
        super(roleProps, id);
        this.questionAnswered = false;
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
