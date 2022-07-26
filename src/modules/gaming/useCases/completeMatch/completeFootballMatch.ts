import { CompleteMatchDTO } from "./completeMatch.dto";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { AthleteRepo, MatchRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Match } from "../../domain/match";
import { MatchDoesNotExistError } from "../makePrediction/makePredictionErrors";
import { ApiFootballService } from "../../services/footballService/apiFootballService";
import { FootballQuestion } from "../../domain/types";
import { CompleteMatchError } from "./completeMatch.errors";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Match>
>;

export class CompleteFootballMatch
    implements UseCase<CompleteMatchDTO, Promise<Response>>
{
    constructor(
        private matchRepo: MatchRepo,
        private apiFootballService: ApiFootballService,
        private athleteRepo: AthleteRepo
    ) {}

    // This is the catch-all (finally) for a match,
    // answer all questions and perform any tasks that completes a match here
    // Fetch any unanswered question answers and answer question
    async execute(request: CompleteMatchDTO): Promise<Response> {
        const { matchId } = request;

        try {
            const matchCompletionErrors: Record<FootballQuestion, any[]> = {
                [FootballQuestion.Winner]: [],
                [FootballQuestion.FirstToScore]: [],
                [FootballQuestion.BothTeamsScore]: [],
                [FootballQuestion.ManOfTheMatch]: [],
                [FootballQuestion.NoOfGoals]: [],
                [FootballQuestion.CorrectScore]: [],
            };
            const match = await this.matchRepo.getMatchById(matchId);
            if (!match) {
                return left(new MatchDoesNotExistError(matchId));
            }

            const matchDto = await this.apiFootballService.getFixture(
                match,
                true
            );
            // check solutions
            const questions = match.questions;
            // check winner
            const winnerQ = questions.getQuestion(FootballQuestion.Winner);
            if (winnerQ.solution !== matchDto.winner) {
                matchCompletionErrors.winner.push(
                    `Winner solution is incorrect; ${matchDto.winner}`
                );
            }
            if (!winnerQ.solution) {
                match.solveQuestion(FootballQuestion.FirstToScore, "DRAW");
            }
            // check firstToScore matches first goal event; Notify if not
            const firstToScoreQ = questions.getQuestion(
                FootballQuestion.FirstToScore
            );
            const firstToScoreApiFootball = matchDto.events.find(
                (e) => e.type === "goal"
            );
            if (
                firstToScoreQ.solution !== firstToScoreApiFootball?.data?.team
            ) {
                matchCompletionErrors[FootballQuestion.FirstToScore].push(
                    `First to score solution is incorrect; ${firstToScoreApiFootball?.data?.team}`
                );
            }
            // check man of the match using player winner rankings
            const ratings = matchDto.winner
                ? matchDto.playerRatings[matchDto.winner]
                : Object.values(matchDto.playerRatings).flatMap((r) => r);

            const manOfTheMatchData = ratings.sort((a: any, b: any) => a.rating - b.rating)[0];
            const manOfTheMatch =
                await this.athleteRepo.getAthleteByApiFootballId(
                    manOfTheMatchData.apiFootballId
                );
            if (!manOfTheMatch) {
                matchCompletionErrors[FootballQuestion.ManOfTheMatch].push(
                    `Man of the match solution not found; ${manOfTheMatchData.apiFootballId}`
                );
            } else {
                match.solveQuestion(
                    FootballQuestion.ManOfTheMatch,
                    manOfTheMatch.id
                );
            }
            // check both teams score
            const goals = Object.values(matchDto.summary.scores);
            const bothScore = goals[0] && goals[1];
            const bothScoreQ = questions.getQuestion(
                FootballQuestion.BothTeamsScore
            );
            if (bothScoreQ.solution !== bothScore) {
                matchCompletionErrors[FootballQuestion.BothTeamsScore].push(
                    `Both teams score solution is incorrect; ${bothScore}`
                );
            }
            // save total number of goals matches; Notify if not
            match.solveQuestion(
                FootballQuestion.NoOfGoals,
                goals[0] + goals[1]
            );
            // save correct score
            match.solveQuestion(FootballQuestion.CorrectScore, matchDto.goals);

            await this.matchRepo.save(match);
            // confirm all match questions has a solution
            // if not; notify me
            const allSolved = match.allQuestionsAnswered();
            const anyErrors = Object.values(matchCompletionErrors).some(
                (e) => e.length > 0
            );
            if (!allSolved || anyErrors) {
                match.setMatchCompletionErrors(matchCompletionErrors);
                await this.matchRepo.save(match);
                return left(new CompleteMatchError(matchCompletionErrors));
            }

            return right(Result.ok<Match>(match));
        } catch (err) {
            return left(
                new AppError.UnexpectedError(
                    err,
                    this.constructor.name,
                    request
                )
            );
        }
    }
}
