import { UseCase } from "../../../../lib/core/UseCase";
import { AuthService } from "../../services/authService";
import { Either, left, Result, right } from "../../../../lib/core/Result";
import { LogoutDTO } from "./LogoutDTO";
import * as AppError from "../../../../lib/core/AppError";
import { LogoutErrors } from "./LogoutErrors";
import { UserRepo } from "../../repos/interfaces";

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class LogoutUseCase implements UseCase<LogoutDTO, Promise<Response>> {
    private userRepo: UserRepo;
    private authService: AuthService;

    constructor(userRepo: UserRepo, authService: AuthService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }

    public async execute(request: LogoutDTO): Promise<Response> {
        const { userId } = request;

        try {
            try {
                await this.userRepo.getUserByUserId(userId);
            } catch (err) {
                return left(new LogoutErrors.UserNotFoundOrDeletedError());
            }

            await this.authService.deAuthenticateUser(userId);

            return right(Result.ok<void>());
        } catch (err) {
            return left(
                new AppError.UnexpectedError(err, this.constructor.name, {
                    userId,
                })
            );
        }
    }
}
