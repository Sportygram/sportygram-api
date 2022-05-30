import { Permission } from "../domain/permission";
import { Role } from "../domain/role";
import { Token } from "../domain/token";
import { UserTokens } from "../domain/userTokens";
import { User } from "../domain/user";
import { UserEmail } from "../domain/valueObjects/userEmail";
import { NexusGenObjects } from "../../../infra/http/graphql/nexus-typegen";

export interface PermissionRepo {
    getPermissionById(permissionId: string): Promise<Permission | undefined>;
    getPermissionByValue(
        permissionValue: string
    ): Promise<Permission | undefined>;
    save(permission: Permission): Promise<void>;
}

export interface RoleRepo {
    getRoleById(roleId: string): Promise<Role | undefined>;
    getRole(roleName: string): Promise<Role | undefined>;
    save(role: Role): Promise<void>;
}

export interface TokenRepo {
    delete(token: Token): Promise<void>;
    saveBulk(userTokens: UserTokens): Promise<void>;
    save(token: Token): Promise<void>;
}

export interface UserRepo {
    exists(userId: string): Promise<boolean>;
    getUserByReferralCode(referralCode: string): Promise<User | undefined>;
    getUserByUserId(userId: string): Promise<User | undefined>;
    getUserByEmail(email: UserEmail | string): Promise<User | undefined>;
    getUserByUsername(userName: string): Promise<User | undefined>;
    getAllUsers(): Promise<User[]>;
    delete(user: User): Promise<void>;
    save(user: User): Promise<void>;
}
export type QueryUser = NexusGenObjects["User"];
export interface UserReadRepo {
    getUserById(userId: string): Promise<QueryUser | undefined>;
}