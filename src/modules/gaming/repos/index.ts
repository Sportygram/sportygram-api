import { PrismaPlayerRepo } from "./implementations/prismaChatUserRepo";
import { PrismaMatchPredictionReadRepoRepo } from "./implementations/prismaMatchPredictionReadRepo";
import { PrismaMatchPredictionRepo } from "./implementations/prismaMatchPredictionRepo";
import { PrismaMatchReadRepo } from "./implementations/prismaMatchReadRepo";
import { PrismaMatchRepo } from "./implementations/prismaMatchRepo";

export const matchPredictionRepo = new PrismaMatchPredictionRepo();
export const matchRepo = new PrismaMatchRepo();
export const matchReadRepo = new PrismaMatchReadRepo();
export const playerRepo = new PrismaPlayerRepo();
export const matchPredictionReadRepo = new PrismaMatchPredictionReadRepoRepo();
