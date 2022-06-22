import { MatchDTO } from "./createMatchDTO";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { MatchRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Match } from "../../domain/match";
import { LeagueId } from "../../domain/leagueId";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { MatchQuestions } from "../../domain/valueObjects/matchQuestions";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Match>
>;

export class CreateMatch implements UseCase<MatchDTO, Promise<Response>> {
    constructor(private matchRepo: MatchRepo) {
        this.matchRepo = matchRepo;
    }

    async execute(request: MatchDTO): Promise<Response> {
        const {
            teams,
            sport,
            status,
            dateTime,
            periods,
            season,
            venue,
            winner,
            summary,
            questions,
            sources,
            metadata,
        } = request;

        try {
            const matchOrError: Result<Match> = Match.create({
                teams,
                sport,
                status,
                dateTime: new Date(dateTime),
                periods,
                season,
                leagueId: LeagueId.create(new UniqueEntityID(1)).getValue(),
                venue,
                winner,
                summary,
                questions: MatchQuestions.create(questions).getValue(),
                sources,
                metadata,
            });

            if (matchOrError.isFailure && matchOrError.error) {
                return left(new AppError.InputError(matchOrError.error));
            }

            const match = matchOrError.getValue();
            await this.matchRepo.save(match);

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
