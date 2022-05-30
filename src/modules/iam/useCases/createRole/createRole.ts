import { CreateRoleDTO } from "./createRoleDTO";
import { RoleAlreadyExistsError } from "./createRoleErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { RoleRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Role } from "../../domain/role";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { UserPermissions } from "../../domain/userPermissions";

type Response = Either<
    | RoleAlreadyExistsError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<Role>
>;

export class CreateRole implements UseCase<CreateRoleDTO, Promise<Response>> {
    private roleRepo: RoleRepo;

    constructor(roleRepo: RoleRepo) {
        this.roleRepo = roleRepo;
    }

    @hasPermissions("CreateRole", ["edit:role"])
    async execute(request: CreateRoleDTO): Promise<Response> {
        const { name, description } = request;

        try {
            // Check if Role exists
            const existingRole = await this.roleRepo.getRole(name);
            if (existingRole) {
                return left(new RoleAlreadyExistsError(name));
            }

            const roleOrError: Result<Role> = Role.create({
                name,
                description,
                permissions: UserPermissions.create([]),
            });

            if (roleOrError.isFailure && roleOrError.error) {
                return left(new AppError.InputError(roleOrError.error));
            }

            const role = roleOrError.getValue();
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
