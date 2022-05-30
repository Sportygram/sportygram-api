import { CreatePermissionDTO } from "./createPermissionDTO";
import { PermissionAlreadyExistsError } from "./createPermissionErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { PermissionRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { Permission } from "../../domain/permission";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { IAMPermission as P } from "../../domain/iam.permissions";

type Response = Either<
    | PermissionAlreadyExistsError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<Permission>
>;

export class CreatePermission
    implements UseCase<CreatePermissionDTO, Promise<Response>>
{
    private permissionRepo: PermissionRepo;

    constructor(permissionRepo: PermissionRepo) {
        this.permissionRepo = permissionRepo;
    }

    @hasPermissions("CreatePermission", [P.EditPermission, P.System])
    async execute(request: CreatePermissionDTO): Promise<Response> {
        const { accessMode, resource, description } = request;

        try {
            // Check if Permission exists
            const value = Permission.getPermissionValue(accessMode, resource);
            const existingPermission =
                await this.permissionRepo.getPermissionByValue(value);
            if (existingPermission) {
                return left(new PermissionAlreadyExistsError(value));
            }

            const permissionOrError: Result<Permission> = Permission.create({
                accessMode: accessMode,
                resource,
                description,
            });

            if (permissionOrError.isFailure && permissionOrError.error) {
                return left(new AppError.InputError(permissionOrError.error));
            }

            const permission = permissionOrError.getValue();
            await this.permissionRepo.save(permission);

            return right(Result.ok<Permission>(permission));
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
