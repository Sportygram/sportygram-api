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
    dateTime: string;
    periods: Periods;
    season: string;
    venue: string;
    winner?: string;
    summary: Summary;
    questions: any[];
    sources: Sources;
    metadata: MatchMetadata;
}
