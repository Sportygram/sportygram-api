import { Prisma, Sport } from "@prisma/client";
import dayjs from "dayjs";

export const competitionSeed = [
    {
        id: 1,
        name: "English Premier League",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        sport: "football" as Sport,
        country: "england",
        countryCode: "GB",
        season: "2022",
        sources: {
            apiFootball: {
                id: 39,
                type: "League",
            },
        } as Prisma.JsonObject,
    },
    {
        id: 2,
        name: "Major League Soccer",
        logo: "https://media.api-sports.io/football/leagues/253.png",
        sport: "football" as Sport,
        country: "USA",
        countryCode: "US",
        season: "2022",
        sources: {
            apiFootball: {
                id: 253,
                type: "League",
            },
        } as Prisma.JsonObject,
    },
];

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
