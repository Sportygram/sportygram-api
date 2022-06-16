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
            teams: matchEntity.matchTeams.map((mt) => mt.team),
        };

        return MatchMap.toDomain(matchWithTeams);
    }

    async save(match: Match): Promise<void> {
        const rawMatch = MatchMap.toPersistence(match);

        const matchTeams = {
            createMany: {
                data: match.teams.map((t) => ({ teamId: t.id })),
            },
        };

        const pMatch = {
            ...rawMatch,
            matchTeams,
            periods: rawMatch.periods as Prisma.JsonObject,
            summary: rawMatch.summary as Prisma.JsonObject,
            sources: rawMatch.sources as Prisma.JsonObject,
            metadata: rawMatch.metadata as Prisma.JsonObject,
            questions: rawMatch.questions as Prisma.JsonObject,
        };
        await prisma.match.upsert({
            where: { id: rawMatch.id },
            update: pMatch,
            create: pMatch,
        });
    }
}
