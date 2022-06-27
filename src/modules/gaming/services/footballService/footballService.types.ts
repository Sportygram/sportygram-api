import { Match } from "../../domain/match";
import { Athlete, Team } from "../../domain/types";
import { MatchDTO } from "../../useCases/createMatch/createMatchDTO";

export interface FootballService {
    getCompetitions(): Promise<any>;
    getTeams(): Promise<Team[]>;
    getTeamAthletes(team: Team): Promise<Athlete[]>;
    getFixtures(): Promise<MatchDTO[]>;
    getMatchLineUp(): Promise<any>;
    getLiveMatch(match: Match): Promise<MatchDTO>;
    getMatchStatistics(): Promise<any>;
}
