import { RemoveUserFromRoleDTO } from "./removeUserFromRoleDTO";
import {
    RoleDoesNotExistError,
    UserDoesNotExistError,
} from "./removeUserFromRoleErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { RoleRepo, UserRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { User } from "../../domain/user";

type Response = Either<
    | RoleDoesNotExistError
    | UserDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<User>
>;

export class RemoveUserFromRole
    implements UseCase<RemoveUserFromRoleDTO, Promise<Response>>
{
    private roleRepo: RoleRepo;
    private userRepo: UserRepo;

    constructor(roleRepo: RoleRepo, userRepo: UserRepo) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
    }

    @hasPermissions("RemoveUserFromRole", ["edit:role_assignment", "system"])
    async execute(request: RemoveUserFromRoleDTO): Promise<Response> {
        const { roleName, userId } = request;

        try {
            const user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(new UserDoesNotExistError(userId));
            }
            // Check if Role exists
            const role = await this.roleRepo.getRole(roleName);
            if (!role) {
                return left(new RoleDoesNotExistError(roleName));
            }

            user.removeRole(role);

            await this.userRepo.save(user);

            return right(Result.ok<User>(user));
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
