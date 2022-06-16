import { Prisma, Sport } from "@prisma/client";

export const leagueSeed = [
    {
        id: 1,
        name: "English Premier League",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        sport: "football" as Sport,
        country: "england",
        season: "2022",
        sources: {
            apiFootball: {
                id: 39,
            },
        } as Prisma.JsonObject,
    },
];