import { RequestEmailVerificationDTO } from "./requestEmailVerificationDTO";
import { UserDoesNotExistError } from "./requestEmailVerificationErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UserRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Token, TokenType } from "../../domain/token";

export type RequestEmailVerificationResponse = Either<
    | UserDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<void>
>;

export class RequestEmailVerification
    implements
        UseCase<
            RequestEmailVerificationDTO,
            Promise<RequestEmailVerificationResponse>
        >
{
    private userRepo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    async execute(
        request: RequestEmailVerificationDTO
    ): Promise<RequestEmailVerificationResponse> {
        const { userId } = request;

        try {
            const user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(new UserDoesNotExistError(userId));
            }

            const token = Token.create({
                type: TokenType.EmailVerification,
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
