import { prisma } from "../../../../infra/database/prisma/client";
import { config } from "../../../../lib/config";
import { QueryUser, UserReadRepo } from "../interfaces";

const sgramConfig = config.sportygram;
export class PrismaUserReadRepo implements UserReadRepo {
    async getUserById(userId: string): Promise<QueryUser | undefined> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                userRoles: {
                    select: {
                        role: true,
                    },
                },
            },
        });

        if (!user || !user.profile) return undefined;
        const baseUserWithRoles = {
            ...user,
            ...user.profile,
            roles: user.userRoles.map((ur) => ur.role.name),
        };

        return {
            ...baseUserWithRoles,
            profileColour:
                baseUserWithRoles.profileColour ||
                sgramConfig.defaultProfileColour,
            profileImageUrl:
                baseUserWithRoles.profileImageUrl ||
                sgramConfig.defaultProfileImage,
            emailVerified: !baseUserWithRoles.roles.includes(
                sgramConfig.defaultUserRole
            ),
            coinBalance: baseUserWithRoles.coinBalance.toNumber(),
            rooms: [],
        };
    }
}
