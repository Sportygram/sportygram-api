import { ResetPasswordDTO } from "./resetPasswordDTO";
import {
    IncorrectTokenError,
    TokenExpiredError,
    UserDoesNotExistError,
} from "./resetPasswordErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UserRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { UserPassword } from "../../domain/valueObjects/userPassword";

export type ResetPasswordResponse = Either<
    | UserDoesNotExistError
    | TokenExpiredError
    | IncorrectTokenError
    | AppError.UnexpectedError
    | AppError.PermissionsError
    | Result<any>,
    Result<void>
>;

export class ResetPassword
    implements UseCase<ResetPasswordDTO, Promise<ResetPasswordResponse>>
{
    private userRepo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    async execute(request: ResetPasswordDTO): Promise<ResetPasswordResponse> {
        const { userId, token } = request;

        try {
            const user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(new UserDoesNotExistError(userId));
            }

            const verifiedOrError = user.verifyPasswordToken(token);
            if (verifiedOrError.isFailure) {
                return left(new AppError.InputError(verifiedOrError.error));
            }

            const passwordOrError = UserPassword.create({
                value: request.password,
            });

            const passwordHash: UserPassword = passwordOrError.getValue();
            user.setPassword(passwordHash);

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
