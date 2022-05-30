import { PrismaClient } from "@prisma/client";
import { permissionSeed } from "../../../modules/iam/infra/database/seed/permission.seed";
import {
    rolePermissionsSeed,
    roleSeed,
} from "../../../modules/iam/infra/database/seed/role.seed";
const prisma = new PrismaClient();

async function main() {
    await prisma.permission.createMany({
        data: permissionSeed,
        skipDuplicates: true,
    });
    await prisma.role.createMany({
        data: roleSeed,
        skipDuplicates: true,
    });
    await prisma.rolePermissions.createMany({
        data: rolePermissionsSeed,
        skipDuplicates: true,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
