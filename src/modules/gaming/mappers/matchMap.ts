import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import {
    Match as PMatch,
    MatchPrediction,
    Team as PTeam,
} from "@prisma/client";
import { QueryMatch } from "../repos/interfaces";
import { teams } from "../infra/database/seed/team.seed";
import { Match } from "../domain/match";
import { CompetitionId } from "../domain/competitionId";
import { MatchQuestions } from "../domain/valueObjects/matchQuestions";
import {
    MatchMetadata,
    MatchQuestion,
    MatchQuestionsMap,
    Periods,
    Sources,
    Summary,
    TeamMetadata,
} from "../domain/types";
import { groupBy } from "lodash";

export type RawMatch = PMatch & {
    teams: PTeam[];
    periods: Periods;
    sources: Sources;
    summary: Summary;
    metadata: MatchMetadata;
    predictions?: MatchPrediction;
};
export class MatchMap {
    public static footballRawToQueryMatch(raw: RawMatch): QueryMatch {
        const metadata = raw.metadata;
        const summary = raw.summary;
        const periods = raw.periods;

        const homeCode = metadata.teams.home.code;
        const awayCode = metadata.teams.away.code;

        const winner =
            raw.winner === "draw"
                ? raw.winner
                : teams.find((t) => t.id === raw.winner)?.code;

        const predictions = (raw.questions as any as MatchQuestion[]).map(
            (q) => ({
                ...q,
                question: MatchQuestionsMap[q.code],
            })
        );

        const homeTeam = raw.teams.find((t) => t.code === homeCode) as any;
        const awayTeam = raw.teams.find((t) => t.code === awayCode) as any;

        const posArr = ["GK", "D", "M", "F"];
        return {
            ...raw,
            periods, // TODO: Maybe add endOfPeriod scores here
            status: metadata.status,
            winner,
            teams: {
                home: {
                    ...homeTeam,
                    stadium: homeTeam?.metadata?.stadium,
                    winner: winner === "home",
                    statistics: summary.statistics[homeCode],
                    score: summary.scores[homeCode],
                    players: groupBy(
                        homeTeam.teamAthletes.map((a: any, idx: number) => ({
                            id: a.athlete.id,
                            name: a.athlete.name,
                            position: a.position || posArr[idx % 4],
                            number: a.number || idx + 1,
                        })),
                        "position"
                    ),
                } as any,
                away: {
                    ...awayTeam,
                    winner: winner === "away",
                    statistics: summary.statistics[awayCode],
                    score: summary.scores[awayCode],
                    players: groupBy(
                        awayTeam.teamAthletes.map((a: any, idx: number) => ({
                            id: a.athlete.id,
                            name: a.athlete.name,
                            position: a.position || posArr[idx % 4],
                            number: a.number || idx,
                        })),
                        "position"
                    ),
                } as any,
            },
            predictions,
        };
    }

    public static toDomain(raw: RawMatch): Match {
        const competitionId = CompetitionId.create(
            new UniqueEntityID(raw.competitionId)
        ).getValue();
        const teams = raw.teams.map((t) => ({
            ...t,
            sources: t.sources as Record<string, any>,
            metadata: t.metadata as TeamMetadata,
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
                periods: raw.periods,
                season: raw.season,
                competitionId: competitionId,
                venue: raw.venue,
                winner: raw.winner || undefined,
                summary: raw.summary,
                sources: raw.sources,
                questions,
                metadata: raw.metadata,
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
            name: match.name,
            teams: match.teams,
            sport: match.sport,
            status: match.status,
            dateTime: match.dateTime,
            periods: match.periods,
            season: match.season,
            competitionId: Number(match.competitionId.id.toString()),
            venue: match.venue,
            winner: match.winner || null,
            summary: match.summary,
            sources: match.sources,
            questions: match.questions.value as any,
            metadata: match.metadata,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
        };
    }
}
