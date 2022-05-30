import { Role } from "../domain/role";
import { Role as PRole, Permission as PPermission } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { RoleDTO } from "../dtos/roleDTO";
import { UserPermissions } from "../domain/userPermissions";
import { PermissionMap } from "./permissionMap";
import { notEmpty } from "../../../lib/utils/typeUtils";

export type RawRole = PRole & { permissions: PPermission[] };

export class RoleMap {
    public static toDTO(role: Role): RoleDTO {
        return {
            id: role.roleId.id.toString(),
            name: role.name,
            description: role.description,
            permissions: role.permissions.getItems().map(PermissionMap.toDTO),
        };
    }

    public static toDomain(raw: RawRole): Role | undefined {
        const permissions = raw.permissions.map(PermissionMap.toDomain);
        const userPermissions = UserPermissions.create(
            permissions.filter(notEmpty)
        );
        const roleOrError = Role.create(
            {
                name: raw.name,
                description: raw.description,
                permissions: userPermissions,
            },
            new UniqueEntityID(raw.id)
        );
        return roleOrError.isSuccess ? roleOrError.getValue() : undefined;
    }

    public static toPersistence(role: Role): RawRole {
        const permissions = role.permissions
            .getItems()
            .map(PermissionMap.toPersistence);

        return {
            id: role.roleId.id.toString(),
            name: role.name,
            description: role.description,
            permissions,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
}
