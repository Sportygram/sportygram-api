import { chunk, compact } from "lodash";
import { prisma } from "../../../../../infra/database/prisma/client";
import { sleep } from "../../../../../lib/utils/sleep";
import { Team } from "../../../domain/types";
import { apiFootballService } from "../../../services/footballService";
import athleteData from "./athleteData.json";

export async function seedAthletesFromApi() {
    // get all teams on the db
    const allTeams = (await prisma.team.findMany()) as Team[];
    // get each team's players
    const athletesSeedChunk = chunk(allTeams, 5);
    for (let teams of athletesSeedChunk) {
        const teamsAthletes = await Promise.all(
            teams.map(async (team) => {
                const athletesSeed = await apiFootballService.getTeamAthletes(
                    team
                );
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
        await sleep(30000);
    }
}

export function athletesSeed() {
    return athleteData;
}
