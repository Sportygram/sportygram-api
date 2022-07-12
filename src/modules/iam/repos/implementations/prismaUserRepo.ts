import { UserState } from "@prisma/client";
import { prisma } from "../../../../infra/database/prisma/client";
import { User } from "../../domain/user";
import { v4 as uuidv4 } from "uuid";
import { UserEmail } from "../../domain/valueObjects/userEmail";
import { RawRole, RoleMap } from "../../mappers/roleMap";
import { RawUser, UserMap } from "../../mappers/userMap";
import { UserRepo } from "../interfaces";
import { TokenMap } from "../../mappers/tokenMap";
import { JsonObject } from "swagger-ui-express";

export class PrismaUserRepo implements UserRepo {
    constructor() {}

    async getUser(where: any): Promise<User | undefined> {
        where.userState = UserState.active;
        const baseUser = await prisma.user.findFirst({
            where,
            include: {
                userRoles: {
                    select: {
                        role: {
                            include: {
                                rolePermissions: {
                                    select: { permission: true },
                                },
                            },
                        },
                    },
                },
                tokens: true,
            },
        });

        if (!baseUser) return undefined;
        const baseUserWithRoles: RawUser = {
            ...baseUser,
            roles: baseUser.userRoles.map((ur) => {
                const role: RawRole = {
                    ...ur.role,
                    permissions: ur.role.rolePermissions.map(
                        (rp) => rp.permission
                    ),
                };
                return role;
            }),
        };

        return UserMap.toDomain(baseUserWithRoles);
    }

    async exists(userId: string): Promise<boolean> {
        if (!userId) return false;
        const baseUser = await prisma.user.findFirst({
            where: { id: userId, userState: UserState.active },
        });
        return !!baseUser;
    }

    async getUserByReferralCode(
        referralCode: string
    ): Promise<User | undefined> {
        if (!referralCode) return undefined;
        return this.getUser({ referralCode });
    }

    async getUserByUserId(userId: string): Promise<User | undefined> {
        if (!userId) return undefined;
        return this.getUser({ id: userId });
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        if (!username) return undefined;
        return this.getUser({ username });
    }

    async getUserByEmail(
        userEmail: string | UserEmail
    ): Promise<User | undefined> {
        if (!userEmail) return undefined;
        const email =
            userEmail instanceof UserEmail ? userEmail.value : userEmail;
        return this.getUser({ email });
    }

    async getAllUsers(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    async delete(_user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async save(user: User): Promise<void> {
        const rawUser = await UserMap.toPersistence(user);

        const tokens = {
            createMany: {
                data: user.tokens
                    .getNewItems()
                    .map(TokenMap.toPersistence)
                    .map((t: any) => {
                        delete t.userId;
                        return t;
                    }),
                skipDuplicates: true,
            },
        };

        const deletedTokens = user.tokens
            .getRemovedItems()
            .map(TokenMap.toPersistence)
            .map((t: any) => ({ id: t.id }));

        const userRoles = {
            createMany: {
                data: user.roles
                    .getItems()
                    .map(RoleMap.toPersistence)
                    .map((role) => {
                        return { roleId: role.id };
                    }),
                skipDuplicates: true,
            },
        };

        const deletedRoles = user.roles
            .getRemovedItems()
            .map(RoleMap.toPersistence)
            .map((role) => {
                return { roleId: role.id };
            });

        const rawUserWithoutTokens: Partial<RawUser> = rawUser;
        delete rawUserWithoutTokens.roles;

        await prisma.user.upsert({
            where: {
                id: rawUser.id || undefined,
            },
            update: {
                ...rawUserWithoutTokens,
                metadata: rawUser.metadata as JsonObject,
                tokens: { ...tokens, deleteMany: deletedTokens },
                userRoles: { ...userRoles, deleteMany: deletedRoles },
            },

            create: {
                ...(rawUserWithoutTokens as RawUser),
                metadata: rawUser.metadata as JsonObject,
                tokens,
                userRoles,
                profile: {
                    create: {
                        id: uuidv4(),
                        onboarded: false,
                        settings: {},
                        displayName: `${user.firstname || ""} ${
                            user.lastname || ""
                        }`.trim(),
                    },
                },
            },
        });

        // this.saveUserTokens(user.tokens);
    }
}
