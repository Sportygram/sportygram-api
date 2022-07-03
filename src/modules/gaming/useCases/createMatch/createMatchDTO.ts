import {
    MatchMetadata,
    Periods,
    Sources,
    Summary,
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
    summary: Summary;
    sources: Sources;
    metadata: MatchMetadata;
}
