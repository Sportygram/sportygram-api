import { Prisma } from "@prisma/client";
import { prisma } from "../../../../infra/database/prisma/client";
import { Match } from "../../domain/match";
import { MatchMap } from "../../mappers/matchMap";
import { MatchRepo } from "../interfaces";

export class PrismaMatchRepo implements MatchRepo {
    async getMatchById(matchId: string): Promise<Match | undefined> {
        if (!matchId) return undefined;
        const matchEntity = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                matchTeams: {
                    select: {
                        team: true,
                    },
                },
            },
        });

        if (!matchEntity) return undefined;
        const matchWithTeams = {
            ...matchEntity,
            sources: matchEntity.sources as Record<string, any>,
            teams: matchEntity.matchTeams.map((mt) => mt.team),
        };

        return MatchMap.toDomain(matchWithTeams);
    }

    async save(match: Match): Promise<void> {
        const rawMatch = MatchMap.toPersistence(match);

        const matchTeamsData = {
            data: match.teams.map((t) => ({ teamId: t.id })),
        };

        const pMatch = {
            ...rawMatch,
            teams: undefined,
            periods: rawMatch.periods as Prisma.JsonObject,
            summary: rawMatch.summary as Prisma.JsonObject,
            sources: rawMatch.sources,
            metadata: rawMatch.metadata as Prisma.JsonObject,
            questions: rawMatch.questions as Prisma.JsonObject,
        };

        const foundMatches = await prisma.match.findMany({
            where: {
                OR: [
                    { id: pMatch.id },
                    ...(pMatch.sources.apiFootball?.id && [
                        {
                            sources: {
                                path: ["apiFootball", "id"],
                                equals: pMatch.sources.apiFootball?.id,
                            },
                        },
                    ]),
                ],
            },
        });

        if (foundMatches.length) {
            foundMatches.forEach((m) => {
                console.log(`Match ${m.id} already exists`);
            });
            await prisma.match.update({
                where: { id: foundMatches[0].id },
                data: { ...pMatch },
            });
        } else {
            await prisma.match.create({
                data: { ...pMatch, matchTeams: { createMany: matchTeamsData } },
            });
        }
    }
}