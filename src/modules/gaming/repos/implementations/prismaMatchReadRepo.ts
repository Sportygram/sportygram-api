import dayjs from "dayjs";
import { prisma } from "../../../../infra/database/prisma/client";
import {
    MatchMetadata,
    MatchStatus,
    Periods,
    Sources,
    Summary,
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
            summary: match.summary as Summary,
            sources: match.sources as Sources,
            metadata: match.sources as MatchMetadata,
            teams: match.matchTeams.map((mt) => mt.team),
            predictions: match.matchPredictions[0] as any,
        };
        return MatchMap.footballRawToQueryMatch(matchWithTeams);
    }

    async getMatchesByDate(
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
                        team: true,
                    },
                },
            },
        });

        const matchesWithTeams: RawMatch[] = matches.map((match) => ({
            ...match,
            periods: match.periods as Periods,
            summary: match.summary as Summary,
            sources: match.sources as Sources,
            metadata: match.metadata as MatchMetadata,
            teams: match.matchTeams.map((mt) => mt.team),
        }));
        return matchesWithTeams.map(MatchMap.footballRawToQueryMatch);
    }
}
