import {
    MatchMetadata,
    Periods,
    Sources,
    MatchSummary,
    Team,
} from "../../domain/types";

export interface MatchDTO {
    id?: string;
    teams: Team[];
    sport: string;
    status: string;
    competitionId: number;
    dateTime: string;
    periods: Periods;
    season: string;
    venue: string;
    winner?: string;
    summary: MatchSummary;
    sources: Sources;
    metadata: MatchMetadata;
}
