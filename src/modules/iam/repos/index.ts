import { PrismaPermissionRepo } from "./implementations/prismaPermissionRepo";
import { PrismaRoleRepo } from "./implementations/prismaRoleRepo";
import { PrismaUserReadRepo } from "./implementations/prismaUserReadRepo";
import { PrismaUserRepo } from "./implementations/prismaUserRepo";

export const userRepo = new PrismaUserRepo();
export const userReadRepo = new PrismaUserReadRepo();
export const roleRepo = new PrismaRoleRepo();
export const permissionRepo = new PrismaPermissionRepo();
