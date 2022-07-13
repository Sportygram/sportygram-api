import { prisma } from "../../../../infra/database/prisma/client";
import { FollowerRepo } from "../interfaces";

export class PrismaFollowerRepo implements FollowerRepo {
    async followingUser(followerId: string, userId: string): Promise<boolean> {
        const follower = await prisma.follower.findUnique({
            where: {
                userId_followerId: { userId, followerId },
            },
        });

        return !!follower;
    }

    async followUser(followerId: string, userId: string): Promise<void> {
        await prisma.follower.create({
            data: {
                userId,
                followerId,
            },
        });
    }

    async unfollowUser(followerId: string, userId: string): Promise<void> {
        await prisma.follower.deleteMany({
            where: {
                userId,
                followerId,
            },
        });
    }
}
