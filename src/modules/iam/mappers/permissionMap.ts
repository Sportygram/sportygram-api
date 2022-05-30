import { Permission } from "../domain/permission";
import { Permission as RawPermission } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { PermissionDTO } from "../dtos/permissionDTO";

export class PermissionMap {
    public static toDTO(permission: Permission): PermissionDTO {
        return {
            id: permission.permissionId.id.toString(),
            accessMode: permission.accessMode,
            resource: permission.resource,
            value: permission.value,
            description: permission.description,
        };
    }

    public static toDomain(raw: RawPermission): Permission | undefined {
        const permissionOrError = Permission.create(
            {
                accessMode: raw.accessMode,
                description: raw.description,
                resource: raw.resource,
            },
            new UniqueEntityID(raw.id)
        );
        return permissionOrError.isSuccess
            ? permissionOrError.getValue()
            : undefined;
    }

    public static toPersistence(permission: Permission): RawPermission {
        return {
            id: permission.permissionId.id.toString(),
            accessMode: permission.accessMode,
            description: permission.description,
            resource: permission.resource,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
        };
    }
}
