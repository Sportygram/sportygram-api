import { RawUserProfile, UserProfileMap } from "../../mappers/userProfileMap";
import { UserProfile } from "../../domain/userProfile";
import { UserProfileRepo } from "../interfaces";
import { prisma } from "../../../../infra/database/prisma/client";
import { JsonObject } from "swagger-ui-express";

export class PrismaUserProfileRepo implements UserProfileRepo {
    constructor() {}

    async getUserProfileByUserId(
        userId: string
    ): Promise<UserProfile | undefined> {
        if (!userId) return undefined;
        const baseUserProfile = await prisma.userProfile.findUnique({
            where: { userId },
        });

        if (!baseUserProfile) return undefined;
        return UserProfileMap.toDomain(baseUserProfile);
    }

    async save(userProfile: UserProfile): Promise<void> {
        const rawUserProfile: RawUserProfile = await UserProfileMap.toPersistence(userProfile);
        const pUserProfile = {
            ...rawUserProfile,
            settings: rawUserProfile.settings as JsonObject,
            gamesSummary: rawUserProfile.gamesSummary as JsonObject
        }
        await prisma.userProfile.upsert({
            where: { id: rawUserProfile.id },
            update: pUserProfile,
            create: pUserProfile,
        });
    }
}
