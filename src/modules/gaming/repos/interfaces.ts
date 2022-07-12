import { NexusGenObjects } from "../../../infra/http/graphql/nexus-typegen";
import { Game } from "../domain/game";
import { Match } from "../domain/match";
import { MatchPrediction } from "../domain/matchPrediction";
import { Player } from "../domain/player";
import { RoomGame } from "../domain/roomGame";
import { Sport } from "../domain/types";

export interface PlayerRepo {
    createAllUserGameSummaries(game: Game): Promise<number>;
    getAllPlayers(gameId?: string): Promise<Player[]>
    getPlayerByUserId(userId: string): Promise<Player | undefined>;
    save(player: Player): Promise<void>;
}

export type MatchSetData = {
    id: string;
    dateTime: Date;
};

export interface LiveMatchInput {
    sport: Sport;
    lastUpdatedMinutes?: number;
}
export interface MatchRepo {
    getMatchById(matchId: string): Promise<Match | undefined>;
    getMatchByApiFootballId(apiFootballId: string): Promise<Match | undefined>;
    getLiveMatches(params?: LiveMatchInput): Promise<Match[]>;
    getUpcomingMatches(options?: {
        nextMatch: boolean;
    }): Promise<MatchSetData[]>;
    save(match: Match): Promise<void>;
}
export type QueryMatch = NexusGenObjects["Match"];
export interface MatchReadRepo {
    getMatchById(
        matchId: string,
        userId: string
    ): Promise<QueryMatch | undefined>;
    getMatchesByDate(
        userId: string,
        date: Date,
        live?: boolean
    ): Promise<QueryMatch[]>;
}

export interface MatchPredictionRepo {
    getPredictionById(
        predictionId: string
    ): Promise<MatchPrediction | undefined>;
    getPredictionsByMatchId(matchId: string): Promise<MatchPrediction[]>;
    save(prediction: MatchPrediction): Promise<void>;
}

export type QueryMatchPrediction = NexusGenObjects["MatchPrediction"];
export interface MatchPredictionReadRepo {
    getMatchPredictionById(
        predictionId: string
    ): Promise<QueryMatchPrediction | undefined>;
}

export interface GameRepo {
    getGameById(gameId: string): Promise<Game | undefined>;
    getActiveGames(competitionId?: string): Promise<Game[]>;
    getEndedGames(): Promise<Game[]>
    save(game: Game): Promise<void>;
}
export interface RoomGameRepo {
    getLiveRoomGames(competitionId: number): Promise<RoomGame[]>;
    getRoomPlayers(roomId: string, gameId?: string): Promise<Player[]>;
    getRoomGamesByGameId(gameId: string): Promise<RoomGame[]>;
    save(roomGame: RoomGame): Promise<void>;
}
