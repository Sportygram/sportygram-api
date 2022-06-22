import { Team } from "../../domain/types";

export interface MatchDTO {
    teams: Team[];
    sport: string;
    status: string;
    dateTime: string;
    periods: Record<string, string>;
    season: string;
    venue: string;
    winner?: string;
    summary: Record<string, any>;
    questions: any[];
    sources: Record<string, any>;
    metadata: Record<string, any>;
}
