import { AssignRoleToUserDTO } from "./assignRoleToUserDTO";
import {
    RoleDoesNotExistError,
    UserDoesNotExistError,
} from "./assignRoleToUserErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { User } from "../../domain/user";
import { RoleRepo, UserRepo } from "../../repos/interfaces";

type Response = Either<
    | RoleDoesNotExistError
    | UserDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<User>
>;

export class AssignRoleToUser
    implements UseCase<AssignRoleToUserDTO, Promise<Response>>
{
    private roleRepo: RoleRepo;
    private userRepo: UserRepo;

    constructor(roleRepo: RoleRepo, userRepo: UserRepo) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
    }

    @hasPermissions("AssignRoleToUser", ["edit:role_assignment", "system"])
    async execute(request: AssignRoleToUserDTO): Promise<Response> {
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

            user.addRole(role);

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
