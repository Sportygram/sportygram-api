import { Statistic } from "../../domain/types";

export type Paging = {
    current: number;
    total: number;
};

export type LeagueResponseData = {
    league: {
        id: number;
        name: string;
        type: "League" | "Cup";
        logo: string;
    };
    country: {
        name: string;
        code: string;
        flag: string;
    };
    seasons: {
        year: number;
        start: string;
        end: string;
        current: boolean;
        coverage: {
            fixtures: {
                events: boolean;
                lineups: boolean;
                statistics_fixtures: boolean;
                statistics_players: boolean;
            };
            standings: boolean;
            players: boolean;
            top_scorers: boolean;
            top_assists: boolean;
            top_cards: boolean;
            injuries: boolean;
            predictions: boolean;
            odds: boolean;
        };
    }[];
};

export type TeamResponseData = {
    team: {
        id: number;
        name: string;
        code: string;
        country: string;
        founded: number;
        national: boolean;
        logo: string;
    };
    venue: {
        id: number;
        name: string;
        address: string;
        city: string;
        capacity: number;
        surface: string;
        image: string;
    };
};

export type PlayerResponseData = {
    player: {
        id: number;
        name: string;
        firstname: string;
        lastname: string;
        age: number;
        birth: {
            date: string;
            place: string;
            country: string;
        };
        nationality: string;
        height: string;
        weight: string;
        injured: boolean;
        photo: string;
    };
    statistics: any;
};

const FixtureStatus = {
    TBD: "Time To Be Defined",
    NS: "Not Started",
    "1H": "First Half, Kick Off",
    HT: "Halftime",
    "2H": "Second Half, 2nd Half Started",
    ET: "Extra Time",
    P: "Penalty In Progress",
    FT: "Match Finished",
    AET: "Match Finished After Extra Time",
    PEN: "Match Finished After Penalty",
    BT: "Break Time (in Extra Time)",
    SUSP: "Match Suspended",
    INT: "Match Interrupted",
    PST: "Match Postponed",
    CANC: "Match Cancelled",
    ABD: "Match Abandoned",
    AWD: "Technical Loss",
    WO: "WalkOver",
} as const;

export const FixtureShortStatus = [
    "TBD",
    "NS",
    "1H",
    "HT",
    "2H",
    "ET",
    "P",
    "FT",
    "AET",
    "PEN",
    "BT",
    "SUSP",
    "INT",
    "PST",
    "CANC",
    "ABD",
    "AWD",
    "WO",
] as const;
export type FixtureShortStatus = typeof FixtureShortStatus[number];
type FixtureLongStatus = typeof FixtureStatus[keyof typeof FixtureStatus];

type FixtureTeamData = {
    id: number; // 52;
    name: string; // "Crystal Palace";
    logo: string; // "https://media.api-sports.io/football/teams/52.png";
    winner?: boolean | null;
};

type FixtureTeamColor = {
    primary: string;
    number: string;
    border: string;
};

type FixtureTeamPlayer = {
    player: {
        id: number;
        name: string;
        number: number;
        pos: "G" | "D" | "M" | "F";
        grid: string | null;
    };
};

export type FixtureTeamLineup = {
    team: FixtureTeamData & {
        colors: { player: FixtureTeamColor; goalkeeper: FixtureTeamColor };
    };
    formation: string;
    startXI: FixtureTeamPlayer[];
    substitutes: FixtureTeamPlayer[];
    coach: {
        id: number;
        name: string;
        photo: string;
    };
}

export type FixtureEventType = "Goal" | "Card" | "subst" | "Var";

export type FixtureData = {
    fixture: {
        id: number; // 867946
        referee: string | null;
        timezone: string; // "UTC";
        date: string; // "2022-08-05T19:00:00+00:00";
        timestamp: number; // 1659726000;
        periods: {
            first: number | null;
            second: number | null;
        };
        venue: {
            id: number; // 525;
            name: string; // "Selhurst Park";
            city: string; // "London";
        };
        status: {
            long: FixtureLongStatus; // "Not Started";
            short: FixtureShortStatus; // "NS";
            elapsed: number | null;
        };
    };
    league: {
        id: number; // 39;
        name: string; // "Premier League";
        country: string; // "England";
        logo: string; // "https://media.api-sports.io/football/leagues/39.png";
        flag: string; // "https://media.api-sports.io/flags/gb.svg";
        season: number; // 2022;
        round: string; // "Regular Season - 1";
    };
    teams: {
        home: FixtureTeamData;
        away: FixtureTeamData;
    };
    goals: {
        home: number | null;
        away: number | null;
    };
    score: {
        halftime: {
            home: number | null;
            away: number | null;
        };
        fulltime: {
            home: number | null;
            away: number | null;
        };
        extratime: {
            home: number | null;
            away: number | null;
        };
        penalty: {
            home: number | null;
            away: number | null;
        };
    };
    events: {
        time: {
            elapsed: number;
            extra: number | null;
        };
        team: FixtureTeamData;
        player: {
            id: number;
            name: string;
        };
        assist: {
            id: number;
            name: string;
        };
        type: FixtureEventType;
        detail: string;
        comments: string | null;
    }[];
    lineups: FixtureTeamLineup[];
    statistics: {
        team: FixtureTeamData;
        statistics: Statistic[];
    }[];
    players: {
        team: FixtureTeamData & { update: string }; // update: "2022-07-09T04:30:08+04:30",
        players: {
            player: { id: number; name: string; photo: string };
            statistics: {
                games: {
                    minutes: number;
                    number: number;
                    position: string;
                    rating: string;
                    captain: boolean;
                    substitute: boolean;
                };
                offsides: number | null;
                shots: {
                    total: number | null;
                    on: number | null;
                };
                goals: {
                    total: number | null;
                    conceded: number;
                    assists: number | null;
                    saves: number | null;
                };
                passes: {
                    total: number | null;
                    key: number | null;
                    accuracy: string | null;
                };
                tackles: {
                    total: number | null;
                    blocks: number | null;
                    interceptions: number | null;
                };
                duels: {
                    total: number | null;
                    won: number | null;
                };
                dribbles: {
                    attempts: number | null;
                    success: number | null;
                    past: number | null;
                };
                fouls: {
                    drawn: number | null;
                    committed: number | null;
                };
                cards: {
                    yellow: number;
                    red: number;
                };
                penalty: {
                    won: number | null;
                    committed: number | null;
                    scored: number;
                    missed: number;
                    saved: number;
                };
            }[];
        }[];
    }[];
};
