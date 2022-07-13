import { PrismaFollowerRepo } from "./implementations/prismaFollowerRepo";
import { PrismaUserProfileRepo } from "./implementations/prismaUserProfileRepo";

export const userProfileRepo = new PrismaUserProfileRepo();
export const followerRepo = new PrismaFollowerRepo();
