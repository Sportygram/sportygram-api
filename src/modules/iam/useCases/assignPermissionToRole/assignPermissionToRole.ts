import { AssignPermissionToRoleDTO } from "./assignPermissionToRoleDTO";
import {
    RoleDoesNotExistError,
    PermissionDoesNotExistError,
} from "./assignPermissionToRoleErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { Role } from "../../domain/role";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { PermissionRepo, RoleRepo } from "../../repos/interfaces";

type Response = Either<
    | RoleDoesNotExistError
    | PermissionDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<Role>
>;

export class AssignPermissionToRole
    implements UseCase<AssignPermissionToRoleDTO, Promise<Response>>
{
    private roleRepo: RoleRepo;
    private permissionRepo: PermissionRepo;

    constructor(roleRepo: RoleRepo, permissionRepo: PermissionRepo) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
    }

    @hasPermissions("CreateRole", ["edit:role"])
    async execute(request: AssignPermissionToRoleDTO): Promise<Response> {
        const { roleId, permissionValue } = request;

        try {
            // Check if Role exists
            const role = await this.roleRepo.getRoleById(roleId);
            if (!role) {
                return left(new RoleDoesNotExistError(roleId));
            }
            const permission = await this.permissionRepo.getPermissionByValue(
                permissionValue
            );
            if (!permission) {
                return left(new PermissionDoesNotExistError(permissionValue));
            }

            role.addPermission(permission);

            await this.roleRepo.save(role);

            return right(Result.ok<Role>(role));
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
