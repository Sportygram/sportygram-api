import * as dotenv from "dotenv";
dotenv.config();

// import { seedAthletesFromApi } from "../../../modules/gaming/infra/database/seed/athlete.seed";
// import { seedMatches } from "../../../modules/gaming/infra/database/seed/match.seed";
import { competitionSeed, gamesSeed } from "../../../modules/gaming/infra/database/seed/gaming.seed";
import {
    teamCompetitionSeed,
    teamSeed,
} from "../../../modules/gaming/infra/database/seed/team.seed";
import { permissionSeed } from "../../../modules/iam/infra/database/seed/permission.seed";
import {
    rolePermissionsSeed,
    roleSeed,
} from "../../../modules/iam/infra/database/seed/role.seed";
import { prisma } from "./client";
// import { teamsAthleteSeed } from "../../../modules/gaming/infra/database/seed/teamsAthletes.seed";
// import { athletesSeed } from "../../../modules/gaming/infra/database/seed/athlete.seed";

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
    await prisma.competition.createMany({
        data: competitionSeed,
        skipDuplicates: true,
    });
    await prisma.game.createMany({
        data: gamesSeed,
        skipDuplicates: true,
    });
    await prisma.team.createMany({
        data: teamSeed.map((t) => ({ ...t, competition: undefined })),
        skipDuplicates: true,
    });
    await prisma.teamCompetition.createMany({
        data: teamCompetitionSeed,
        skipDuplicates: true,
    });
    
    // TODO: Admin endpoint for seeding matches, teams, athletes using API
    // Use minimal data for competitions, matches, teams, athletes
    // await seedMatches();
    // await seedAthletesFromApi();
    // await prisma.athlete.createMany({
    //     data: athletesSeed(),
    //     skipDuplicates: true,
    // });
    // await prisma.teamAthlete.createMany({
    //     data: teamsAthleteSeed,
    //     skipDuplicates: true,
    // });
    return;
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
