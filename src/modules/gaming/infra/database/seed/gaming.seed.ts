import { Prisma, Sport } from "@prisma/client";
import dayjs from "dayjs";

export const competitionSeed = [
    {
        id: 1,
        name: "English Premier League",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        sport: "football" as Sport,
        short: "EPL",
        country: "England",
        countryCode: "GB",
        season: "2022",
        startDate: new Date("2022-08-05T00:00:00.000Z"),
        endDate: new Date("2023-05-28T00:00:00.000Z"),
        sources: {
            apiFootball: {
                id: 39,
                type: "League",
            },
            sportsdata: {
                competitionId: 1,
                seasonId: 235,
            },
        } as Prisma.JsonObject,
    },
    {
        id: 2,
        name: "Major League Soccer",
        logo: "https://media.api-sports.io/football/leagues/253.png",
        sport: "football" as Sport,
        country: "USA",
        short: "MLS",
        countryCode: "US",
        season: "2022",
        startDate: new Date("2022-02-26T00:00:00.000Z"),
        endDate: new Date("2022-11-05T00:00:00.000Z"),
        sources: {
            apiFootball: {
                id: 253,
                type: "League",
            },
            sportsdata: {
                competitionId: 8,
                seasonId: 203,
            },
        } as Prisma.JsonObject,
    },
    {
        id: 3,
        name: "Primera Division (LaLiga)",
        logo: "https://media.api-sports.io/football/leagues/140.png",
        sport: "football" as Sport,
        country: "Spain",
        short: "ESP",
        countryCode: "ES",
        season: "2022",
        startDate: new Date("2022-08-14T00:00:00Z"),
        endDate: new Date("2023-06-04T00:00:00Z"),
        sources: {
            apiFootball: {
                id: 140,
                type: "League",
            },
            sportsdata: {
                competitionId: 4,
                seasonId: 252,
            },
        } as Prisma.JsonObject,
    },
    {
        id: 4,
        name: "Bundesliga",
        logo: "https://media.api-sports.io/football/leagues/78.png",
        sport: "football" as Sport,
        country: "Germany",
        short: "DEB",
        countryCode: "DE",
        season: "2022",
        startDate: new Date("2022-08-05T00:00:00Z"),
        endDate: new Date("2023-06-05T00:00:00Z"),
        sources: {
            apiFootball: {
                id: 78,
                type: "League",
            },
            sportsdata: {
                competitionId: 2,
                seasonId: 234,
            },
        } as Prisma.JsonObject,
    },
    {
        id: 5,
        name: "Serie A",
        logo: "https://media.api-sports.io/football/leagues/135.png",
        sport: "football" as Sport,
        country: "Italy",
        short: "ITSA",
        countryCode: "IT",
        season: "2022",
        startDate: new Date("2022-08-12T00:00:00Z"),
        endDate: new Date("2023-06-05T00:00:00Z"),
        sources: {
            apiFootball: {
                id: 135,
                type: "League",
            },
            sportsdata: {
                competitionId: 6,
                seasonId: 249,
            },
        } as Prisma.JsonObject,
    },
];

export const competitions = competitionSeed.map((c) => ({
    ...c,
    id: c.id.toString(),
}));

export const gamesSeed = [
    {
        id: "0adb6035-b48d-4747-826b-5f282df7eb6a",
        name: "MLS weekly game",
        type: "weekly",
        status: "in_progress",
        metadata: {},
        competitionId: 2,
        expiringAt: dayjs()
            .add(1, "week")
            .startOf("week")
            .add(1, "day")
            .toDate(),
    },
    {
        id: "82628d95-f725-4cd5-9136-29e9ac057ff7",
        name: "EPL weekly game",
        type: "weekly",
        status: "in_progress",
        metadata: {},
        competitionId: 1,
        expiringAt: dayjs()
            .add(1, "week")
            .startOf("week")
            .add(1, "day")
            .toDate(),
    },
    {
        id: "84aed53a-f320-418c-b630-1b56d16af419",
        name: "MLS season game",
        type: "season",
        status: "in_progress",
        metadata: {},
        competitionId: 2,
        expiringAt: new Date("2022-10-09 23:00:00"),
    },
] as Prisma.GameCreateManyInput[];
