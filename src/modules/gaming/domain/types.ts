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

export interface Competition {
    id: string;
    name: string;
    logo: string;
    sport: Sport;
    country: CountryCode;
    season: string;
    sources: Record<string, any>; // source: { sourceId: string }
}

export type TeamCode = Partial<string>;
export type TeamMetadata = {
    coach?: { name: string; photo: string };
    stadium: string;
};
export interface Team {
    id: number;
    name: string;
    code: string;
    logo: string;
    sport: Sport;
    competitions?: Competition[]; // same team can play in different competitions so this should be in a relation table
    sources: Record<string, any>;
    metadata: TeamMetadata;
    formation?: string;
    colours?: any;
    athletes?: { id: number }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Athlete {
    id?: number;
    name: string;
    firstname: string;
    lastname: string;
    nationality: string;
    photo: string;
    sources: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}

export const MatchStatus = {
    Unscheduled: "unscheduled",
    Scheduled: "scheduled",
    InProgress: "in_progress",
    Break: "break",
    Suspended: "suspended",
    Cancelled: "cancelled",
    Completed: "completed",
} as const;
export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

export type Statistic = { type: string; value: any };

export const FootballPeriod = [
    "first",
    "second",
    "firstExtra",
    "secondExtra",
    "penalties",
] as const;
export type FootballPeriod = typeof FootballPeriod[number];

export type Goal = {
    teamCode: TeamCode;
    goal: number;
    scorer?: { id: number; name: string };
    minute?: string;
};

export type Summary = {
    scores: Record<TeamCode, number>;
    scoresByPeriodEnd: Record<
        FootballPeriod,
        Record<TeamCode, number | null> | undefined
    >;
    statistics: Record<TeamCode, Statistic[] | undefined>;
    goals?: Record<TeamCode, Goal[]>;
};

export type Periods = Record<Partial<FootballPeriod>, string>;
export interface Match {
    id: string;
    teams: Team[];
    sport: Sport;
    status: MatchStatus;
    date: Date;
    periods: Periods;
    season: string;
    competitionId: number;
    venue: string;
    winner?: Team;
    summary: Summary; // scores, teamId-StatisticsObj
    sources: Sources;
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
    CorrectScore: "correct_score",
} as const;
export type FootballQuestion =
    typeof FootballQuestion[keyof typeof FootballQuestion];

export const MatchQuestionsMap: Record<MatchQuestionCode, MatchQuestion> = {
    [FootballQuestion.Winner]: {
        code: FootballQuestion.Winner,
        question: "Who will win the match?",
        type: "select",
        correctPoints: 2,
    },
    [FootballQuestion.FirstToScore]: {
        code: FootballQuestion.FirstToScore,
        question: "What team scores first?",
        type: "select",
        correctPoints: 2,
    },
    [FootballQuestion.ManOfTheMatch]: {
        code: FootballQuestion.ManOfTheMatch,
        question: "Who is the man of the match?",
        type: "select",
        correctPoints: 2,
    },
    [FootballQuestion.BothTeamsScore]: {
        code: FootballQuestion.BothTeamsScore,
        question: "Do both teams score?",
        type: "select",
        correctPoints: 2,
    },
    [FootballQuestion.NoOfGoals]: {
        code: FootballQuestion.NoOfGoals,
        question: "How many goals will be scored?",
        type: "input",
        correctPoints: 2,
    },
    [FootballQuestion.CorrectScore]: {
        code: FootballQuestion.CorrectScore,
        question: "Correct score?",
        type: "customData",
        correctPoints: 5,
    },
};

export type MatchQuestionCode = FootballQuestion;
type MatchQuestionType = "select" | "input" | "customData";

export type PlayerPrediction = MatchQuestion & { value: any; points: number };
export interface MatchQuestion {
    code: MatchQuestionCode;
    type: MatchQuestionType;
    correctPoints: number;
    question?: string;
    options?: { value: string; display: string }[];
    solution?: any;
}

export interface RoomGame {
    id: string;
    name: string;
    description: string;
    roomId: string;
    competitionId: string;
    type: "weekly" | "season";
    status: "completed" | "in_progress";
    summary: any; // week: number; might include an array of players and points
    leaderboard: LeaderboardPlayer[];
    expiringAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const MatchEvent = [
    "kickoff",
    "goal",
    "penalty",
    "substitution",
    "red_card",
    "period_complete",
    "period_started",
    "completed",
];
export type MatchEvent = typeof MatchEvent[number];

export interface MatchEventData {
    type: MatchEvent;
    message: string;
    data: any;
}

export const DataSource = {
    ApiFootball: "apiFootball",
} as const;
export type DataSource = typeof DataSource[keyof typeof DataSource];

export type Sources = Record<Partial<DataSource>, { id: any }>;

type HomeAway<T> = {
    home: T;
    away: T;
};

type FootballTeams = HomeAway<{ id: number; name: string; code: string }>;
// type AthleticsTeams = {
//     lane1: { id: number; name: string; code: string };
//     lane2: { id: number; name: string; code: string };
//     ...
// };
export type MatchMetadata = {
    status: {
        long: string;
        short: string;
        elapsed: number | null;
    };
    teams: FootballTeams;
};

export type LineUpPlayer = {
    id: number;
    name: string;
    pos: string;
    num: number;
    start: boolean;
};

export type LeaderboardPlayer = {
    playerId: string;
    username?: string;
    score: number;
    rank: number;
    prevRank: number;
};
