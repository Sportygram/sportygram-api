import { Athlete, Team } from "../../domain/types";
import { MatchDTO } from "../../useCases/createMatch/createMatchDTO";

export interface FootballService {
    getLeagues(): Promise<any>;
    getTeams(): Promise<Team[]>;
    getTeamAthletes(team: Team): Promise<Athlete[]>;
    getFixtures(): Promise<MatchDTO[]>;
    getMatchLineUp(): Promise<any>;
    getLiveMatchUpdates(): Promise<any>;
    getMatchStatistics(): Promise<any>;
}
