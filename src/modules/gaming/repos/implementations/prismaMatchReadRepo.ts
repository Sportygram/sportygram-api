import dayjs from "dayjs";
import { prisma } from "../../../../infra/database/prisma/client";
import { MatchStatus } from "../../domain/types";
import { MatchMap, RawMatch } from "../../mappers/matchMap";
import { MatchReadRepo, QueryMatch } from "../interfaces";

export class PrismaMatchReadRepo implements MatchReadRepo {
    async getMatchById(matchId: string): Promise<QueryMatch | undefined> {
        if (!matchId) return undefined;
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                matchTeams: {
                    select: {
                        team: true,
                    },
                },
            },
        });
        if (!match) return undefined;

        const matchWithTeams: RawMatch = {
            ...match,
            teams: match.matchTeams.map((mt) => mt.team),
        };
        return MatchMap.rawToQueryMatch(matchWithTeams);
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
                  date: {
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
            teams: match.matchTeams.map((mt) => mt.team),
        }));
        return matchesWithTeams.map(MatchMap.rawToQueryMatch);
    }
}
