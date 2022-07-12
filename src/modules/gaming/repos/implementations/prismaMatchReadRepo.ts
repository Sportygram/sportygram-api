import dayjs from "dayjs";
import { prisma } from "../../../../infra/database/prisma/client";
import {
    MatchMetadata,
    MatchStatus,
    Periods,
    Sources,
    MatchSummary,
} from "../../domain/types";
import { MatchMap, RawMatch } from "../../mappers/matchMap";
import { MatchReadRepo, QueryMatch } from "../interfaces";

export class PrismaMatchReadRepo implements MatchReadRepo {
    async getMatchById(
        matchId: string,
        userId: string
    ): Promise<QueryMatch | undefined> {
        if (!matchId) return undefined;
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                matchTeams: {
                    select: {
                        team: true,
                    },
                },
                matchPredictions: {
                    where: { userId },
                },
            },
        });
        if (!match) return undefined;

        const matchWithTeams: RawMatch = {
            ...match,
            periods: match.periods as Periods,
            summary: match.summary as MatchSummary,
            sources: match.sources as Sources,
            metadata: match.sources as MatchMetadata,
            teams: match.matchTeams.map((mt) => mt.team),
            predictions: match.matchPredictions[0] as any,
        };
        return MatchMap.footballRawToQueryMatch(matchWithTeams);
    }

    async getMatchesByDate(
        userId: string,
        date?: string | Date,
        live = false
    ): Promise<QueryMatch[]> {
        const matchDate = dayjs(date).startOf("date").toDate();
        const nextDay = dayjs(matchDate).add(1, "day").toDate();

        const where = live
            ? {
                  status: MatchStatus.InProgress,
              }
            : {
                  dateTime: {
                      gte: matchDate,
                      lt: nextDay,
                  },
              };

        const matches = await prisma.match.findMany({
            where,
            include: {
                matchTeams: {
                    select: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                logo: true,
                                sport: true,
                                sources: true,
                                metadata: true,
                                createdAt: true,
                                updatedAt: true,
                                teamAthletes: {
                                    select: {
                                        position: true,
                                        number: true,
                                        athlete: {
                                            select: {
                                                id: true,
                                                name: true,
                                                metadata: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                matchPredictions: {
                    where: { userId },
                },
            },
            orderBy: { dateTime: "asc" },
        });

        const matchesWithTeams: RawMatch[] = matches.map((match) => ({
            ...match,
            periods: match.periods as Periods,
            summary: match.summary as MatchSummary,
            sources: match.sources as Sources,
            metadata: match.metadata as MatchMetadata,
            teams: match.matchTeams.map((mt) => mt.team),
            predictions: match.matchPredictions[0] as any,
        }));
        return matchesWithTeams.map(MatchMap.footballRawToQueryMatch);
    }
}
