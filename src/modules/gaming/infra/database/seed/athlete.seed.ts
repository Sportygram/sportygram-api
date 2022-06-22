import { compact } from "lodash";
import { prisma } from "../../../../../infra/database/prisma/client";
import { Team } from "../../../domain/types";
import { apiFootballService } from "../../../services/footballService";

export async function seedAthletes() {
    // get all teams on the db
    const allTeams = (await prisma.team.findMany()) as Team[];
    // get each team's players
    const teamsAthletes = await Promise.all(
        allTeams.map(async (team) => {
            const athletesSeed = await apiFootballService.getTeamAthletes(team);
            const savedAthletes = await Promise.all(
                athletesSeed.map(async (athlete) => {
                    try {
                        const savedAthlete = await prisma.athlete.create({
                            data: athlete,
                        });
                        return savedAthlete;
                    } catch (err) {
                        console.log(err);
                        return undefined;
                    }
                })
            );

            return compact(savedAthletes).map((athlete) => ({
                teamId: team.id,
                athleteId: athlete.id,
            }));
        })
    );
    const teamAthleteSeed = teamsAthletes.flat();
    // save each team player in each team to the db
    await prisma.teamAthlete.createMany({
        data: teamAthleteSeed,
        skipDuplicates: true,
    });
}
