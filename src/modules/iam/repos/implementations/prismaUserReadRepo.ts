import { prisma } from "../../../../infra/database/prisma/client";
import { config } from "../../../../lib/config";
import { QueryUser, UserReadRepo } from "../interfaces";

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
            profileImageUrl:
                baseUserWithRoles.profileImageUrl ||
                "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg",
            emailVerified:
                baseUserWithRoles.roles[0] ===
                config.sportygram.defaultUserRole,
            coinBalance: baseUserWithRoles.coinBalance.toNumber(),
            rooms: [],
        };
    }
}
