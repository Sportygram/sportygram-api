import { PrismaPlayerRepo } from "./implementations/prismaPlayerRepo";
import { PrismaMatchPredictionReadRepoRepo } from "./implementations/prismaMatchPredictionReadRepo";
import { PrismaMatchPredictionRepo } from "./implementations/prismaMatchPredictionRepo";
import { PrismaMatchReadRepo } from "./implementations/prismaMatchReadRepo";
import { PrismaMatchRepo } from "./implementations/prismaMatchRepo";
import { PrismaRoomGameRepo } from "./implementations/prismaRoomGameRepo";
import { PrismaGameRepo } from "./implementations/prismaGameRepo";

export const matchPredictionRepo = new PrismaMatchPredictionRepo();
export const matchRepo = new PrismaMatchRepo();
export const matchReadRepo = new PrismaMatchReadRepo();
export const playerRepo = new PrismaPlayerRepo();
export const matchPredictionReadRepo = new PrismaMatchPredictionReadRepoRepo();
export const roomGameRepo = new PrismaRoomGameRepo();
export const gameRepo = new PrismaGameRepo();
