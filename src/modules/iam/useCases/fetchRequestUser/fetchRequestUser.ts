import * as AppError from "../../../../lib/core/AppError";
import { Either, left, Result, right } from "../../../../lib/core/Result";
import { UseCase } from "../../../../lib/core/UseCase";
import {
    JWTClaims,
    RequestUserDTO,
} from "../../../../lib/utils/permissions";
import { UserMap } from "../../mappers/userMap";
import { UserRepo } from "../../repos/interfaces";
import { AuthService } from "../../services/authService";
import * as FetchUserUseCaseErrors from "./fetchUserErrors";

type Response = Either<
    | FetchUserUseCaseErrors.UserDoesntExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<RequestUserDTO>
>;

export class FetchRequestUser implements UseCase<JWTClaims, Promise<Response>> {
    constructor(private userRepo: UserRepo, private authService: AuthService) {}

    async execute(decoded: JWTClaims): Promise<Response> {
        const { userId } = decoded;
        try {
            let requestUser = await this.authService.getCachedUserPermissions(
                userId
            );
            if (requestUser) {
                return right(Result.ok<RequestUserDTO>(requestUser));
            } else {
                const user = await this.userRepo.getUserByUserId(userId);

                if (!user)
                    return left(
                        new FetchUserUseCaseErrors.UserDoesntExistError(userId)
                    );
                requestUser = UserMap.toRequestUserDTO(user);

                await this.authService.cacheUserPermissions(requestUser);
                return right(Result.ok<RequestUserDTO>(requestUser));
            }
        } catch (error) {
            return left(
                new AppError.UnexpectedError(
                    error,
                    this.constructor.name,
                    decoded
                )
            );
        }
    }
}
