import * as AppError from "../../../../lib/core/AppError";
import { Either, left, Result, right } from "../../../../lib/core/Result";
import { UseCase } from "../../../../lib/core/UseCase";
import { UserPassword } from "../../domain/valueObjects/userPassword";
import { DeleteUserDTO } from "./deleteUserDTO";
import * as DeleteUserUseCaseErrors from "./deleteUserErrors";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { IAMPermission as P } from "../../domain/iam.permissions";
import { UserRepo } from "../../repos/interfaces";

type Response = Either<
    | DeleteUserUseCaseErrors.UserIdDoesntExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<void>
>;

export class DeleteUser implements UseCase<DeleteUserDTO, Promise<Response>> {
    constructor(private userRepo: UserRepo) {}

    @hasPermissions("DeleteUser", [P.Me, P.DeleteUser])
    async execute(request: DeleteUserDTO): Promise<Response> {
        try {
            const { userId } = request;

            //#region Validate DTO
            const passwordOrError = UserPassword.create({
                value: request.password,
            });

            if (passwordOrError.isFailure) {
                return left(
                    new AppError.InputError(passwordOrError.error)
                ) as Response;
            }
            //#endregion

            //#region Attempt to Fetch User
            const password: UserPassword = passwordOrError.getValue();
            const requestUser = await this.userRepo.getUserByUserId(
                request.requestUser.userId
            );
            //#endregion

            // If user does not exist, return Error(Email or Password incorrect)
            if (!requestUser) {
                return left(
                    new AppError.PermissionsError(
                        "Delete User",
                        request.requestUser.userId
                    )
                );
            }

            // Attempt to Match Password with PasswordHash
            const passwordValid =
                await requestUser.passwordHash?.comparePassword(password.value);

            // If password does not match, return Error(Email or Password incorrect)
            if (!passwordValid) {
                return left(
                    new DeleteUserUseCaseErrors.PasswordDoesntMatchError()
                );
            }

            // Delete user with userId
            const user = await this.userRepo.getUserByUserId(userId);
            // If user does not exist, return Error(Email or Password incorrect)
            if (!user) {
                return left(
                    new DeleteUserUseCaseErrors.UserIdDoesntExistError()
                );
            }

            user.delete();
            await this.userRepo.save(user);

            return right(Result.ok());
        } catch (error) {
            return left(
                new AppError.UnexpectedError(
                    error,
                    this.constructor.name,
                    request
                )
            );
        }
    }
}
