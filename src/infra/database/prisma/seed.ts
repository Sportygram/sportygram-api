import { PrismaClient } from "@prisma/client";
import { athleteSeed, teamAthleteSeed } from "../../../modules/gaming/infra/database/seed/athlete.seed";
import { leagueSeed } from "../../../modules/gaming/infra/database/seed/gaming.seed";
import {
    teamLeagueSeed,
    teamSeed,
} from "../../../modules/gaming/infra/database/seed/team.seed";
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
    await prisma.rolePermission.createMany({
        data: rolePermissionsSeed,
        skipDuplicates: true,
    });
    await prisma.league.createMany({
        data: leagueSeed,
        skipDuplicates: true,
    });
    await prisma.team.createMany({
        data: teamSeed,
        skipDuplicates: true,
    });
    await prisma.teamLeague.createMany({
        data: teamLeagueSeed,
        skipDuplicates: true,
    });
    await prisma.athlete.createMany({
        data: athleteSeed,
        skipDuplicates: true,
    });
    await prisma.teamAthlete.createMany({
        data: teamAthleteSeed,
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
