import { Prisma, Sport } from "@prisma/client";

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
