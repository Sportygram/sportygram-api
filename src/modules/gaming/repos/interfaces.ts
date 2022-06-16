import { NexusGenObjects } from "../../../infra/http/graphql/nexus-typegen";
import { Match } from "../domain/match";
import { MatchPrediction } from "../domain/matchPrediction";
import { Player } from "../domain/player";

export interface PlayerRepo {
    getPlayerByUserId(userId: string): Promise<Player | undefined>;
    save(player: Player): Promise<void>;
}
export interface MatchRepo {
    getMatchById(matchId: string): Promise<Match | undefined>;
    save(match: Match): Promise<void>;
}
export type QueryMatch = NexusGenObjects["Match"];
export interface MatchReadRepo {
    getMatchById(matchId: string): Promise<QueryMatch | undefined>;
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
