import { UseCase } from "../../../../lib/core/UseCase";
import { AuthService } from "../../services/authService";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { JWTToken } from "../../domain/valueObjects/jwt";
import * as RefreshAccessTokenErrors from "./RefreshAccessTokenErrors";
import { UserRepo } from "../../repos/interfaces";
import { User } from "../../domain/user";
import { RefreshAccessTokenDTO } from "./RefreshAccessTokenDTO";
import { UserMap } from "../../mappers/userMap";
import { LoginDTOResponse } from "../login/loginDTO";

type Response = Either<
    RefreshAccessTokenErrors.RefreshTokenNotFound | AppError.UnexpectedError,
    Result<LoginDTOResponse>
>;

export class RefreshAccessToken
    implements UseCase<RefreshAccessTokenDTO, Promise<Response>>
{
    private userRepo: UserRepo;
    private authService: AuthService;

    constructor(userRepo: UserRepo, authService: AuthService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }

    public async execute(req: RefreshAccessTokenDTO): Promise<Response> {
        const { refreshToken } = req;
        let user: User | undefined;
        let userId: string;

        try {
            // Get the username for the user that owns the refresh token
            try {
                userId = await this.authService.getUserIdFromRefreshToken(
                    refreshToken
                );
            } catch (err) {
                return left(
                    new RefreshAccessTokenErrors.RefreshTokenNotFound()
                );
            }

            // get the user by username
            user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(
                    new RefreshAccessTokenErrors.UserNotFoundOrDeletedError()
                );
            }

            const accessToken: JWTToken = this.authService.signJWT(
                UserMap.toJWTClaim(user)
            );

            // sign a new jwt for that user
            user.setLoginDetails(req.ip);

            // save it
            await this.authService.saveAuthenticatedUser(
                user,
                accessToken,
                refreshToken
            );

            // return the new access token
            return right(
                Result.ok<LoginDTOResponse>({ accessToken, refreshToken, userId })
            );
        } catch (err) {
            return left(
                new AppError.UnexpectedError(err, this.constructor.name, req)
            );
        }
    }
}
