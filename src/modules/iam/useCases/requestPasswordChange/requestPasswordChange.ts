import { RequestPasswordChangeDTO } from "./requestPasswordChangeDTO";
import { UserDoesNotExistError } from "./requestPasswordChangeErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UserRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Token, TokenType } from "../../domain/token";

export type RequestPasswordChangeResponse = Either<
    | UserDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<void>
>;

export class RequestPasswordChange
    implements
        UseCase<
            RequestPasswordChangeDTO,
            Promise<RequestPasswordChangeResponse>
        >
{
    private userRepo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    async execute(
        request: RequestPasswordChangeDTO
    ): Promise<RequestPasswordChangeResponse> {
        const { email } = request;

        try {
            const user = await this.userRepo.getUserByEmail(email);
            if (!user) {
                return left(new UserDoesNotExistError(email));
            }

            const token = Token.create({
                type: TokenType.PasswordReset,
                userId: user.userId,
            }).getValue();

            user.addToken(token);

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
