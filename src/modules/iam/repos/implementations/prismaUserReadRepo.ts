import { prisma } from "../../../../infra/database/prisma/client";
import { config } from "../../../../lib/config";
import { QueryUser, UserReadRepo } from "../interfaces";
import { get } from "lodash";

const huddleConfig = config.huddle;
export class PrismaUserReadRepo implements UserReadRepo {
    async getUserById(userId: string): Promise<QueryUser | undefined> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: {
                    include: {
                        gameSummaries: {
                            select: {
                                type: true,
                                status: true,
                                score: true,
                                summary: true,
                                competitionId: true,
                            },
                        },
                        _count: {
                            select: {
                                followers: true,
                                followings: true,
                            },
                        },
                    },
                },
                userRoles: {
                    select: {
                        role: true,
                    },
                },
            },
        });

        if (!user || !user.profile) return undefined;
        const { profile, userRoles, ...baseUser } = user;
        const baseUserWithRoles = {
            ...baseUser,
            ...user.profile,
            followerCount: get(user.profile, "_count.followers", 0),
            followingCount: get(user.profile, "_count.followings", 0),
            roles: user.userRoles.map((ur) => ur.role.name),
        };

        return {
            ...baseUserWithRoles,
            profileColour:
                baseUserWithRoles.profileColour ||
                huddleConfig.defaultProfileColour,
            profileImageUrl:
                baseUserWithRoles.profileImageUrl ||
                huddleConfig.defaultProfileImage,
            emailVerified: !baseUserWithRoles.roles.includes(
                huddleConfig.defaultUserRole
            ),
            coinBalance: baseUserWithRoles.coinBalance.toNumber(),
            chatData: {
                streamUserId: baseUserWithRoles.id,
                token: get(baseUserWithRoles.metadata, "stream.token"),
            },
        };
    }
}
