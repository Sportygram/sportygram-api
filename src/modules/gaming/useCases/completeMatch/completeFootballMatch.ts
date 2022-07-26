import { CompleteMatchDTO } from "./completeMatch.dto";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { MatchRepo } from "../../repos/interfaces";
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
    ) {}

    // This is the catch-all (finally) for a match,
    // answer all questions and perform any tasks that completes a match here
    // Fetch any unanswered question answers and answer question
    async execute(request: CompleteMatchDTO): Promise<Response> {
        const { matchId } = request;

        try {
            const matchCompletionErrors = {
                [FootballQuestion.Winner]: [],
            } as Record<"winner", any[]>;
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
