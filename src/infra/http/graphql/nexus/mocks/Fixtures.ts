import { v4 as uuid } from "uuid";
import { FootballQuestion } from "../../../../../modules/gaming/domain/types";
import { NexusGenObjects } from "../../nexus-typegen";

type Match = NexusGenObjects["Match"];
type TeamData = NexusGenObjects["TeamData"];

let matchStatusDefault = {
    long: "Match Finished",
    short: "FT",
    elapsed: 90,
};

let teamsDefault: TeamData = {
    home: {
        id: "6",
        name: "Southampton",
        code: "SOU",
        logo: "https://media.api-sports.io/football/teams/41.png",
        score: "1",
        winner: false,
        statistics: [
            {
                type: "Shots on Goal",
                value: "5",
            },
            {
                type: "Shots off Goal",
                value: "10",
            },
            {
                type: "Total Shots",
                value: "24",
            },
            {
                type: "Blocked Shots",
                value: "9",
            },
            {
                type: "Shots insidebox",
                value: "12",
            },
            {
                type: "Shots outsidebox",
                value: "12",
            },
            {
                type: "Fouls",
                value: "6",
            },
            {
                type: "Corner Kicks",
                value: "9",
            },
            {
                type: "Offsides",
                value: "2",
            },
            {
                type: "Ball Possession",
                value: "71%",
            },
            {
                type: "Yellow Cards",
                value: null,
            },
            {
                type: "Red Cards",
                value: null,
            },
            {
                type: "Goalkeeper Saves",
                value: "1",
            },
            {
                type: "Total passes",
                value: "724",
            },
            {
                type: "Passes accurate",
                value: "646",
            },
            {
                type: "Passes %",
                value: "89%",
            },
        ],
        lineup: {
            startingXI: [],
            substitutes: [],
        },
    },
    away: {
        id: "5",
        name: "Liverpool",
        code: "LIV",
        logo: "https://media.api-sports.io/football/teams/40.png",
        score: "2",
        winner: true,
        statistics: [
            {
                type: "Shots on Goal",
                value: "5",
            },
            {
                type: "Shots off Goal",
                value: "10",
            },
            {
                type: "Total Shots",
                value: "24",
            },
            {
                type: "Blocked Shots",
                value: "9",
            },
            {
                type: "Shots insidebox",
                value: "12",
            },
            {
                type: "Shots outsidebox",
                value: "12",
            },
            {
                type: "Fouls",
                value: "6",
            },
            {
                type: "Corner Kicks",
                value: "9",
            },
            {
                type: "Offsides",
                value: "2",
            },
            {
                type: "Ball Possession",
                value: "71%",
            },
            {
                type: "Yellow Cards",
                value: null,
            },
            {
                type: "Red Cards",
                value: null,
            },
            {
                type: "Goalkeeper Saves",
                value: "1",
            },
            {
                type: "Total passes",
                value: "724",
            },
            {
                type: "Passes accurate",
                value: "646",
            },
            {
                type: "Passes %",
                value: "89%",
            },
        ],
        lineup: {
            startingXI: [],
            substitutes: [],
        },
    },
};

let fixtureDefault: Match = {
    id: uuid(),
    name: "Liverpool vs Southampton",
    teams: teamsDefault,
    status: matchStatusDefault,
    dateTime: new Date("2022-05-17T18:45:00.346Z"),
    periods: {
        first: new Date("2022-05-17T18:45:00.346Z"),
        second: new Date("2022-05-17T18:45:00.346Z"),
        firstExtra: undefined,
        secondExtra: undefined,
        penalties: undefined,
    },
    season: "2021/2022",
    venue: "St. Mary's Stadium, Southampton, Hampshire",
    winner: teamsDefault.away?.code,
    userPoints: 6,
    predictions: [
        {
            code: FootballQuestion.Winner,
            solution: "DRAW",
            value: "LIV",
            points: 0,
        },
        {
            code: FootballQuestion.FirstToScore,
            solution: "LIV",
            value: "LIV",
            points: 2,
        },
        {
            code: FootballQuestion.ManOfTheMatch,
            solution: "5",
            value: "5",
            points: 2,
        },
        {
            code: FootballQuestion.BothTeamsScore,
            solution: true,
            value: false,
            points: 0,
        },
        {
            code: FootballQuestion.NoOfGoals,
            solution: 2,
            value: 2,
            points: 2,
        },
        {
            code: FootballQuestion.FinalScore,
            solution: {
                home: 1,
                away: 1,
            },
            value: {
                home: 2,
                away: 0,
            },
            points: 0,
        },
    ],
};

export const getMatchMock = (p?: Partial<Match>): Match => ({
    ...fixtureDefault,
    ...p,
});
