import { PrismaUserProfileRepo } from "./implementations/prismaUserProfileRepo";

const userProfileRepo = new PrismaUserProfileRepo();

export {
    userProfileRepo,
}