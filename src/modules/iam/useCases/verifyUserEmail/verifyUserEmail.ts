import { VerifyUserEmailDTO } from "./verifyUserEmailDTO";
import {
    IncorrectTokenError,
    TokenExpiredError,
    UserDoesNotExistError,
} from "./verifyUserEmailErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UserRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";

export type VerifyUserEmailResponse = Either<
    | UserDoesNotExistError
    | TokenExpiredError
    | IncorrectTokenError
    | AppError.UnexpectedError
    | AppError.PermissionsError
    | Result<any>,
    Result<void>
>;

export class VerifyUserEmail
    implements UseCase<VerifyUserEmailDTO, Promise<VerifyUserEmailResponse>>
{
    private userRepo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    async execute(
        request: VerifyUserEmailDTO
    ): Promise<VerifyUserEmailResponse> {
        const { userId, token } = request;

        try {
            const user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(new UserDoesNotExistError(userId));
            }

            const verifiedOrError = user.verifyEmail(token);
            if (verifiedOrError.isFailure) {
                return left(new AppError.InputError(verifiedOrError.error));
            }

            await this.userRepo.save(user);
            return right(Result.ok<void>());
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
