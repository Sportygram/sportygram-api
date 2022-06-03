import { UserProfile } from "../domain/userProfile";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { UserId } from "../domain/userId";
import { GamesSummary, Settings } from "../domain/valueObjects/settings";
import { UserProfile as PUserProfile } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

export type RawUserProfile = PUserProfile;

export class UserProfileMap {
    public static toDomain(raw: RawUserProfile): UserProfile {
        const userId = UserId.create(new UniqueEntityID(raw.userId)).getValue();

        const userOrError = UserProfile.create(
            {
                userId: userId,
                profileColour: raw.profileColour,
                profileImageUrl: raw.profileImageUrl,
                onboarded: raw.onboarded,
                favoriteTeam: raw.favoriteTeam,
                coinBalance: raw.coinBalance.toNumber(),
                referralCount: raw.referralCount,
                gamesSummary: (raw.gamesSummary as GamesSummary) || {},
                settings: (raw.settings as Settings) || {},
                metadata: (raw.metadata as Settings) || {},
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id)
        );

        if (!userOrError.isSuccess) {
            throw new Error(userOrError.error as string);
        }
        return userOrError.getValue();
    }

    public static async toPersistence(
        profile: UserProfile
    ): Promise<RawUserProfile> {
        return {
            id: profile.userProfileId.id.toString(),
            displayName: null,
            profileColour: profile.profileColour || null,
            profileImageUrl: profile.profileImageUrl || null,
            onboarded: profile.onboarded,
            favoriteTeam: profile.favoriteTeam || null,
            userId: profile.userId.id.toString(),
            settings: profile.settings,
            metadata: profile.metadata,
            gamesSummary: profile.gamesSummary,
            coinBalance: new Decimal(profile.coinBalance),
            referralCount: profile.referralCount,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        };
    }
}
