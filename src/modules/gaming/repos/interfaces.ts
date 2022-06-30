import { NexusGenObjects } from "../../../infra/http/graphql/nexus-typegen";
import { Game } from "../domain/game";
import { Match } from "../domain/match";
import { MatchPrediction } from "../domain/matchPrediction";
import { Player } from "../domain/player";

export interface PlayerRepo {
    getPlayerByUserId(userId: string): Promise<Player | undefined>;
    save(player: Player): Promise<void>;
}

export type MatchSetData = {
    id: string;
    dateTime: Date;
};
export interface MatchRepo {
    getMatchById(matchId: string): Promise<Match | undefined>;
    getMatchByApiFootballId(apiFootballId: string): Promise<Match | undefined>;
    getLiveMatches(lastUpdatedMinutes?: number): Promise<Match[]>;
    getUpcomingMatches(options?: { nextMatch: boolean }): Promise<MatchSetData[]>;
    save(match: Match): Promise<void>;
}
export type QueryMatch = NexusGenObjects["Match"];
export interface MatchReadRepo {
    getMatchById(
        matchId: string,
        userId: string
    ): Promise<QueryMatch | undefined>;
    getMatchesByDate(date: Date): Promise<QueryMatch[]>;
}

export interface MatchPredictionRepo {
    getPredictionById(
        predictionId: string
    ): Promise<MatchPrediction | undefined>;
    save(prediction: MatchPrediction): Promise<void>;
}

export type QueryMatchPrediction = NexusGenObjects["MatchPrediction"];
export interface MatchPredictionReadRepo {
    getMatchPredictionById(
        predictionId: string
    ): Promise<QueryMatchPrediction | undefined>;
}

export interface RoomGameRepo {
    save(roomGame: Game): Promise<void>;
}
