import { prisma } from "../../../../../infra/database/prisma/client";
import logger from "../../../../../lib/core/Logger";
import { apiFootballService } from "../../../services/footballService";
import { createMatch } from "../../../useCases/createMatch";
import { competitionSeed } from "./gaming.seed";

export async function seedMatches() {
    // fetch all fixtures
    const fixturesDTO = (
        await Promise.all(
            competitionSeed.map((comp) => {
                return apiFootballService.getFixtures(comp, true);
            })
        )
    ).flat();

    const results = await Promise.all(
        fixturesDTO.map(async (match) => {
            // save to db
            const result = await createMatch.execute(match);

            // update players position and number
            Object.values(match.lineups).forEach(async (tl: any) => {
                tl.players.forEach(async (player: any) => {
                    const athletes = await prisma.athlete.findMany({
                        where: {
                            sources: {
                                path: ["apiFootball", "id"],
                                equals: player.apiFootballId,
                            },
                        },
                    });

                    if (!athletes.length) return;
                    await prisma.teamAthlete.update({
                        where: {
                            teamId_athleteId: {
                                teamId: tl.teamId,
                                athleteId: athletes[0].id,
                            },
                        },
                        data: {
                            position: player.position,
                            number: player.number,
                        },
                    });
                });
            });

            if (result.isRight()) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: result.value.errorValue().message,
                    match,
                };
            }
        })
    );

    const summary = results.reduce<{
        successCount: number;
        failureCount: number;
        failed: any[];
    }>(
        (prevSummary, result) => {
            !result.success &&
                prevSummary.failed.push(result.match?.sources.apiFootball?.id);
            return {
                successCount:
                    prevSummary.successCount + (result.success ? 1 : 0),
                failureCount:
                    prevSummary.failureCount + (result.success ? 0 : 1),
                failed: prevSummary.failed,
            };
        },
        { successCount: 0, failureCount: 0, failed: [] }
    );

    const result = {
        total: fixturesDTO.length,
        ...summary,
    };
    logger.info("Match seed results", result);
    return result;
}
