import { prisma } from "../../../../infra/database/prisma/client";
import { Athlete } from "../../domain/types";
import { AthleteRepo } from "../interfaces";

export class PrismaAthleteRepo implements AthleteRepo {
    async getAthleteByApiFootballId(
        athleteApiFootballId: number
    ): Promise<Athlete | undefined> {
        if (!athleteApiFootballId) return undefined;
        const athleteEntity = (
            await prisma.athlete.findMany({
                where: {
                    sources: {
                        path: ["apiFootball", "id"],
                        equals: athleteApiFootballId,
                    },
                },
            })
        )[0] as any;

        return athleteEntity;
    }
}
