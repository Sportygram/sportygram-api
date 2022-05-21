import { v4 as uuid } from "uuid";
import { NexusGenObjects } from "../../nexus-typegen";

type Fixture = NexusGenObjects["Fixture"];
type TeamData = NexusGenObjects["TeamData"];

let matchStatusDefault = {
    long: "Match Finished",
    short: "FT",
    elapsed: 90,
};

let teamsDefault: TeamData = {
    home: {
        code: "SOU",
        name: "Southampton",
        logo: "https://media.api-sports.io/football/teams/41.png",
        winner: false,
        score: "1",
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
    },
    away: {
        code: "LIV",
        name: "Liverpool",
        logo: "https://media.api-sports.io/football/teams/40.png",
        winner: true,
        score: "2",
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
    },
};

let fixtureDefault: Fixture = {
    fixtureId: uuid(),
    date: "2022-05-17T18:45:00.346Z",
    periods: [1652813100, 1652816700],
    venue: "St. Mary's Stadium, Southampton, Hampshire",
    misc: {
        id: 710921,
        referee: "Martin Atkinson, England",
        timezone: "UTC",
        timestamp: 1652813100,
        venue: {
            id: 585,
            name: "St. Mary's Stadium",
            city: "Southampton, Hampshire",
        },
        status: matchStatusDefault,
        league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
            flag: "https://media.api-sports.io/flags/gb.svg",
            season: 2021,
            round: "Regular Season - 37",
        },
    },
    teams: teamsDefault,
    predictions: [],
    scores: {
        halftime: {
            home: 1,
            away: 1,
        },
        fulltime: {
            home: 1,
            away: 2,
        },
        extratime: {
            home: null,
            away: null,
        },
        penalty: {
            home: null,
            away: null,
        },
    },
};

export const getFixtureMock = (p?: Partial<Fixture>): Fixture => ({
    ...fixtureDefault,
    ...p,
});
