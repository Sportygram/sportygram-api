import { prisma } from "../../../../infra/database/prisma/client";
import { Role } from "../../domain/role";
import { RoleMap } from "../../mappers/roleMap";
import { RoleRepo } from "../interfaces";

export class PrismaRoleRepo implements RoleRepo {
    constructor() {}

    async getRoleById(roleId: string): Promise<Role | undefined> {
        if (!roleId) return undefined;
        const roleEntity = await prisma.role.findUnique({
            where: { id: roleId },
            include: { rolePermissions: { select: { permission: true } } },
        });
        if (!roleEntity) return undefined;

        const baseRoleWithPermissions = {
            ...roleEntity,
            permissions: roleEntity.rolePermissions.map((rp) => rp.permission),
        };
        return RoleMap.toDomain(baseRoleWithPermissions);
    }

    async getRole(roleName: string): Promise<Role | undefined> {
        if (!roleName) return undefined;
        const roleEntity = await prisma.role.findUnique({
            where: { name: roleName },
            include: { rolePermissions: { select: { permission: true } } },
        });
        if (!roleEntity) return undefined;

        const baseRoleWithPermissions = {
            ...roleEntity,
            permissions: roleEntity.rolePermissions.map((rp) => rp.permission),
        };
        return RoleMap.toDomain(baseRoleWithPermissions);
    }

    async save(role: Role): Promise<void> {
        const rawRole = RoleMap.toPersistence(role);

        await prisma.role.upsert({
            where: { id: rawRole.id },
            update: rawRole,
            create: rawRole,
        });
    }
}
