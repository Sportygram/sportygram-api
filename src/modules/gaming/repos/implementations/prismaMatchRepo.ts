import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "../../../../infra/database/prisma/client";
import { Match } from "../../domain/match";
import {
    MatchMetadata,
    MatchStatus,
    Periods,
    Sources,
    Summary,
} from "../../domain/types";
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
                        team: {
                            include: {
                                teamAthletes: true,
                            },
                        },
                    },
                },
            },
        });

        if (!matchEntity) return undefined;
        const matchWithTeams = {
            ...matchEntity,
            periods: matchEntity.periods as Periods,
            summary: matchEntity.summary as Summary,
            sources: matchEntity.sources as Sources,
            metadata: matchEntity.sources as MatchMetadata,
            teams: matchEntity.matchTeams.map((mt) => {
                return {
                    ...mt.team,
                    athletes: mt.team.teamAthletes.map((ta) => ({
                        id: ta.athleteId,
                    })),
                };
            }),
        };

        return MatchMap.toDomain(matchWithTeams);
    }

    async getMatchByApiFootballId(
        apiFootballId: string
    ): Promise<Match | undefined> {
        if (!apiFootballId) return undefined;
        const matchEntity = (
            await prisma.match.findMany({
                where: {
                    sources: {
                        path: ["apiFootball", "id"],
                        equals: apiFootballId,
                    },
                },
                include: {
                    matchTeams: {
                        select: {
                            team: true,
                        },
                    },
                },
            })
        )[0];

        if (!matchEntity) return undefined;

        const matchWithTeams = {
            ...matchEntity,
            periods: matchEntity.periods as Periods,
            summary: matchEntity.summary as Summary,
            sources: matchEntity.sources as Sources,
            metadata: matchEntity.sources as MatchMetadata,
            teams: matchEntity.matchTeams.map((mt) => mt.team),
        };

        return MatchMap.toDomain(matchWithTeams);
    }

    async getLiveMatches(lastUpdatedMinutes = 1): Promise<Match[]> {
        const updatedAt = dayjs()
            .subtract(lastUpdatedMinutes, "minute")
            .toDate();

        const matchEntities = await prisma.match.findMany({
            where: {
                updatedAt: { gte: updatedAt },
                status: MatchStatus.InProgress,
            },
            include: {
                matchTeams: {
                    select: {
                        team: true,
                    },
                },
            },
        });

        const matchesWithTeams = matchEntities.map((matchEntity) => ({
            ...matchEntity,
            periods: matchEntity.periods as Periods,
            summary: matchEntity.summary as Summary,
            sources: matchEntity.sources as Sources,
            metadata: matchEntity.sources as MatchMetadata,
            teams: matchEntity.matchTeams.map((mt) => mt.team),
        }));

        return matchesWithTeams.map(MatchMap.toDomain);
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
