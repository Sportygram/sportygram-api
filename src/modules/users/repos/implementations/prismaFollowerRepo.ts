import { prisma } from "../../../../infra/database/prisma/client";
import { FollowerRepo } from "../interfaces";

export class PrismaFollowerRepo implements FollowerRepo {
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
