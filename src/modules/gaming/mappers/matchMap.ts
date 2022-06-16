import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Match as PMatch, Team as PTeam } from "@prisma/client";
import { QueryMatch } from "../repos/interfaces";
import { teams } from "../infra/database/seed/team.seed";
import { Match } from "../domain/match";
import { LeagueId } from "../domain/leagueId";
import { MatchQuestions } from "../domain/valueObjects/matchQuestions";
import { MatchQuestion, MatchQuestionsMap } from "../domain/types";

export type RawMatch = PMatch & { teams: PTeam[] };
export class MatchMap {
    public static rawToQueryMatch(raw: RawMatch): QueryMatch {
        const status = {
            long: "Match Finished",
            short: "FT",
            elapsed: 90,
        };
        const metadata = raw.metadata as any;
        const summary = raw.summary as any;
        const periods = raw.periods as any;

        const homeId = metadata?.teams?.home.id;
        const awayId = metadata?.teams?.away.id;

        const winner =
            raw.winner === "draw"
                ? raw.winner
                : teams.find((t) => t.id === raw.winner)?.code;

        const questions = (raw.questions as any as MatchQuestion[]).map(
            (q) => ({
                ...q,
                question: MatchQuestionsMap[q.code],
            })
        );

        return {
            ...raw,
            periods,
            status, // : metadata.status
            scores: summary?.scores,
            winner,
            teams: {
                home: {
                    id: homeId,
                    ...raw.teams.find((t) => t.id === homeId),
                    winner: winner === "home",
                    statistics: summary.statistics[homeId],
                } as any,
                away: {
                    id: awayId,
                    ...raw.teams.find((t) => t.id === awayId),
                    winner: winner === "away",
                    statistics: summary.statistics[homeId],
                } as any,
            },
            questions,
        };
    }

    public static toDomain(raw: RawMatch): Match {
        const leagueId = LeagueId.create(
            new UniqueEntityID(raw.leagueId)
        ).getValue();
        const teams = raw.teams.map((t) => ({
            ...t,
            sources: raw.sources as Record<string, any>,
            createdAt: raw.createdAt || new Date(),
            updatedAt: raw.updatedAt || new Date(),
        }));
        const questions = MatchQuestions.create(
            raw.questions as any as MatchQuestion[]
        ).getValue();

        const matchOrError = Match.create(
            {
                teams,
                sport: raw.sport,
                status: raw.status,
                dateTime: raw.dateTime,
                periods: raw.periods as Record<string, string>,
                season: raw.season,
                leagueId,
                venue: raw.venue,
                winner: raw.winner || undefined,
                summary: raw.summary as Record<string, any>,
                sources: raw.sources as Record<string, any>,
                questions,
                metadata: raw.metadata as Record<string, any>,
                createdAt: raw.createdAt || undefined,
                updatedAt: raw.updatedAt || undefined,
            },
            new UniqueEntityID(raw.id)
        );

        if (!matchOrError.isSuccess) {
            throw new Error(matchOrError.error as string);
        }
        return matchOrError.getValue();
    }

    public static toPersistence(match: Match): RawMatch {
        return {
            id: match.matchId.id.toString(),
            teams: match.teams,
            sport: match.sport,
            status: match.status,
            dateTime: match.dateTime,
            periods: match.periods,
            season: match.season,
            leagueId: Number(match.leagueId.id.toString()),
            venue: match.venue,
            winner: match.winner || null,
            summary: match.summary,
            sources: match.sources,
            questions: match.questions as any,
            metadata: match.metadata,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
        };
    }
}
