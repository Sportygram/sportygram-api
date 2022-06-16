import { Player } from "./player";

// f1 and nascar can be differnt sports if they have different enough rules for their matches
export const Sport = [
    "football",
    "basketball",
    "baseball",
    "cricket",
    "american_football",
    "f1",
    "nascar",
    "running",
] as const;
export type Sport = typeof Sport[number];

export type CountryCode = string;

export interface League {
    id: string;
    name: string;
    logo: string;
    sport: Sport;
    country: CountryCode;
    season: string;
    sources: Record<string, any>; // source: { sourceId: string }
}

export interface Team {
    id: number;
    name: string;
    code: string;
    logo: string;
    sport: Sport;
    leagues?: League[]; // same team can play in different leagues so this should be in a relation table
    sources: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export const MatchStatus = {
    Scheduled: "scheduled",
    InProgress: "in_progress",
    Suspended: "suspended",
    Cancelled: "cancelled",
    Completed: "completed",
} as const;
export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

export type Statistic = { type: string; value: any };

export interface Match {
    id: string;
    teams: Team[];
    sport: Sport;
    status: MatchStatus;
    date: Date;
    periods: Record<string, Date>; // { first: "", firstExtra: "", second: "", secondExtra: "", penalties: "" }
    season: string;
    leagueId: number;
    venue: string;
    winner?: Team;
    summary: Record<string, any>; // scores, teamId-StatisticsObj
    sources: Record<string, any>;
    questions: MatchQuestion[]; // store only solutions
    metadata: any; // home: "MUN", away: "CHE", periodNames(could be in code)
}

export interface MatchPrediction {
    id: string;
    userId: string;
    matchId: string;
    points: number;
    predictions: PlayerPrediction[];
    createdAt: Date;
    updatedAt: Date;
}

export const FootballQuestion = {
    Winner: "winner",
    FirstToScore: "first_to_score",
    ManOfTheMatch: "man_of_the_match",
    BothTeamsScore: "both_teams_score",
    NoOfGoals: "no_of_goals",
    FinalScore: "final_score",
} as const;
export type FootballQuestion =
    typeof FootballQuestion[keyof typeof FootballQuestion];

export const MatchQuestionsMap = {
    [FootballQuestion.Winner]: "Who will win the match?",
    [FootballQuestion.FirstToScore]: "What team scores first?",
    [FootballQuestion.ManOfTheMatch]: "Who is the the match?",
    [FootballQuestion.BothTeamsScore]: "Do both teams score?",
    [FootballQuestion.NoOfGoals]: "How many goals will be the scored?",
    [FootballQuestion.FinalScore]: "Correct score?",
};

export type MatchQuestionCode = FootballQuestion;
type MatchQuestionType = "select" | "input" | "customData";

export type PlayerPrediction = MatchQuestion & { value: any; points: number };
export interface MatchQuestion {
    code: MatchQuestionCode;
    type: MatchQuestionType;
    question?: string;
    options?: { value: string; display: string }[];
    solution?: any;
}

export interface RoomGame {
    id: string;
    name: string;
    description: string;
    roomId: string;
    type: "weekly" | "season";
    status: "completed" | "in_progress";
    summary: any; // might include an array of players and points
    leaderBoard: Player[];
    createdAt: Date;
    expiringAt: Date;
    updatedAt: Date;
}

// Not necessary
// user_profile will contain a weekly score and season score instead
// Group Game will be created and updated instead
// Weekly/Season Group Game will be created immediately after a weekly/season game is completed
// There can be only one open weekly/season game

// interface GroupGamePoints {
//     id: string;
//     userId: string;
//     groupGameId: string;
//     points: number
//     summary: any;
// }
