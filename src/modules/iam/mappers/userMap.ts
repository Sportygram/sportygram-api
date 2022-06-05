import { User as PUser, Token as PToken } from "@prisma/client";
import { User } from "../domain/user";
import { UserPassword } from "../domain/valueObjects/userPassword";
import { UserEmail } from "../domain/valueObjects/userEmail";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { JWTClaims, RequestUserDTO } from "../../../lib/utils/permissions";
import { UserId } from "../domain/userId";
import { UserDTO } from "../dtos/userDTO";
import { UserRoles } from "../domain/userRoles";
import { RawRole, RoleMap } from "./roleMap";
import { UserTokens } from "../domain/userTokens";
import { TokenMap } from "./tokenMap";
import { notEmpty } from "../../../lib/utils/typeUtils";
import { ReferralCode } from "../domain/valueObjects/referralCode";
import { Phone } from "../domain/valueObjects/phone";

export type RawUser = PUser & {
    roles: RawRole[];
    tokens: PToken[];
};
export class UserMap {
    public static toDTO(user: User): UserDTO {
        return {
            email: user.email.value,
            userId: user.userId.id.toString(),
        };
    }

    public static toJWTClaim(user: User): JWTClaims {
        return {
            roles: user.roles.getItems().map((role) => role.name),
            userId: user.userId.id.toString(),
            state: user.userState.toString(),
        };
    }

    public static toRequestUserDTO(user: User): RequestUserDTO {
        return {
            roles: user.roles.getItems().map((role) => role.name),
            userId: user.userId.id.toString(),
            state: user.userState.toString(),
            permissions: user.permissions
                .getItems()
                .map((permission) => permission.value),
        };
    }

    public static toDomain(raw: RawUser): User {
        if (!raw.email) throw new Error(`User with id ${raw.id} has no email`);
        const userPasswordOrError = UserPassword.create({
            value: raw.passwordHash,
            hashed: true,
        });
        const userEmailOrError = UserEmail.create(raw.email);

        const referrerId = raw.referrer
            ? UserId.create(new UniqueEntityID(raw.referrer)).getValue()
            : undefined;
        const referralCode = ReferralCode.create(raw.referralCode).getValue();

        const roles = raw.roles.map(RoleMap.toDomain);
        const userRoles = UserRoles.create(roles.filter(notEmpty));

        const tokens = raw.tokens?.map(TokenMap.toDomain);
        const userTokens = tokens
            ? UserTokens.create(tokens.filter(notEmpty))
            : UserTokens.create([]);

        const userOrError = User.create(
            {
                email: userEmailOrError.getValue(),
                passwordHash: userPasswordOrError.getValue(),
                firstname: raw.firstname || undefined,
                lastname: raw.lastname || undefined,
                phone: raw.phone
                    ? Phone.create(raw.phone).getValue()
                    : undefined,
                country: raw.country || undefined,
                lastLoginIp: raw.lastLoginIp || undefined,
                lastLoginTime: raw.lastLoginTime || undefined,
                referrerId,
                referralCode,
                userState: raw.userState,
                metadata: raw.metadata as Object,
                roles: userRoles,
                tokens: userTokens,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id)
        );

        if (!userOrError.isSuccess) {
            throw new Error(userOrError.error as string);
        }
        return userOrError.getValue();
    }

    public static async toPersistence(user: User): Promise<RawUser> {
        let password: string | undefined;
        if (user.passwordHash.isAlreadyHashed()) {
            password = user.passwordHash.value;
        } else {
            password = await user.passwordHash.getHashedValue();
        }

        return {
            id: user.userId.id.toString(),
            username: user.username || null,
            firstname: user.firstname || null,
            lastname: user.lastname || null,
            phone: user.phone?.value || null,
            country: user.country || null,
            email: user.email.value,
            passwordHash: password,
            roles: user.roles.getItems().map(RoleMap.toPersistence),
            tokens: user.tokens.getItems().map(TokenMap.toPersistence),
            referrer: user.referrerId?.id.toString() || null,
            referralCode: user.referralCode.value,
            userState: user.userState,
            metadata: user.metadata,
            lastLoginIp: user.lastLoginIp || null,
            lastLoginTime: user.lastLoginTime || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
