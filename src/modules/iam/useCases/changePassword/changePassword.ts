import { ChangePasswordDTO } from "./changePasswordDTO";
import {
    UserDoesNotExistError,
    PasswordDoesntMatchError,
} from "./changePasswordErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UserRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { IAMPermission as P } from "../../domain/iam.permissions";
import { UserPassword } from "../../domain/valueObjects/userPassword";
import { AuthService } from "../../services/authService";

export type ChangePasswordResponse = Either<
    | UserDoesNotExistError
    | PasswordDoesntMatchError
    | AppError.UnexpectedError
    | AppError.PermissionsError
    | Result<any>,
    Result<void>
>;

export class ChangePassword
    implements UseCase<ChangePasswordDTO, Promise<ChangePasswordResponse>>
{
    private userRepo: UserRepo;

    constructor(userRepo: UserRepo, private authService: AuthService) {
        this.userRepo = userRepo;
    }

    @hasPermissions("ChangePassword", [P.Me, P.EditUser])
    async execute(request: ChangePasswordDTO): Promise<ChangePasswordResponse> {
        const { userId, oldPassword, newPassword } = request;

        try {
            const user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(new UserDoesNotExistError(userId));
            }

            const passwordOrError = UserPassword.create({
                value: oldPassword,
            });

            const password: UserPassword = passwordOrError.getValue();
            // Attempt to Match Password with PasswordHash
            const passwordValid = await user.passwordHash?.comparePassword(
                password.value
            );
            if (!passwordValid) {
                return left(new PasswordDoesntMatchError());
            }

            const newPasswordOrError = UserPassword.create({
                value: newPassword,
            });

            const newPasswordHash: UserPassword = newPasswordOrError.getValue();
            user.setPassword(newPasswordHash);

            await this.authService.deAuthenticateUser(userId);
            await this.authService.deleteCachedUserPermissions(userId);

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
