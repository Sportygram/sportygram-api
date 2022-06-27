import { MatchDTO } from "./createMatchDTO";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { MatchRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Match } from "../../domain/match";
import { CompetitionId } from "../../domain/competitionId";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { MatchQuestions } from "../../domain/valueObjects/matchQuestions";

type Response = Either<
    AppError.UnexpectedError | AppError.PermissionsError,
    Result<Match>
>;

export class CreateMatch implements UseCase<MatchDTO, Promise<Response>> {
    constructor(private matchRepo: MatchRepo) {}

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
            if (sources.apiFootball?.id) {
                const match = await this.matchRepo.getMatchByApiFootballId(
                    sources.apiFootball.id
                );
                if (match)
                    return left(
                        new AppError.InputError("Match already exists")
                    );
            }

            const matchOrError: Result<Match> = Match.create({
                teams,
                sport,
                status,
                dateTime: new Date(dateTime),
                periods,
                season,
                competitionId: CompetitionId.create(
                    new UniqueEntityID(1)
                ).getValue(),
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
