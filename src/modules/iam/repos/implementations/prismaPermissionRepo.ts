import { AccessMode } from "@prisma/client";
import { prisma } from "../../../../infra/database/prisma/client";
import { Permission } from "../../domain/permission";
import { PermissionMap } from "../../mappers/permissionMap";
import { PermissionRepo } from "../interfaces";

export class PrismaPermissionRepo implements PermissionRepo {
    constructor() {}

    async getPermissionById(
        permissionId: string
    ): Promise<Permission | undefined> {
        if (!permissionId) return undefined;
        const permissionEntity = await prisma.permission.findUnique({
            where: { id: permissionId },
        });
        if (!permissionEntity) return undefined;
        return PermissionMap.toDomain(permissionEntity);
    }

    async getPermissionByValue(
        permissionValue: string
    ): Promise<Permission | undefined> {
        if (!permissionValue) return undefined;
        const { accessMode, resource } =
            Permission.splitPermissionValue(permissionValue);
        const permissionEntity = await prisma.permission.findFirst({
            where: {
                accessMode: AccessMode[accessMode as keyof typeof AccessMode],
                resource,
            },
        });
        if (!permissionEntity) return undefined;
        return PermissionMap.toDomain(permissionEntity);
    }

    async save(permission: Permission): Promise<void> {
        const rawPermission = PermissionMap.toPersistence(permission);
        await prisma.permission.upsert({
            where: { id: rawPermission.id },
            update: rawPermission,
            create: rawPermission,
        });
    }
}
