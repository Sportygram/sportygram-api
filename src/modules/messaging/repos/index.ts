import { PrismaChatUserRepo } from "./implementations/prismaChatUserRepo";
import { PrismaRoomReadRepo } from "./implementations/prismaRoomReadRepo";
import { PrismaRoomRepo } from "./implementations/prismaRoomRepo";

export const chatUserRepo = new PrismaChatUserRepo();
export const roomRepo = new PrismaRoomRepo();
export const roomReadRepo = new PrismaRoomReadRepo();
