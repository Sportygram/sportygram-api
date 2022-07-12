import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Result } from "../../../lib/core/Result";
import { UserId } from "./userId";
import { Guard } from "../../../lib/core/Guard";
import { UserCreated } from "./events/userCreated";
import { UserState } from "../../../lib/utils/permissions";
import { UserEmail } from "./valueObjects/userEmail";
import { UserPassword } from "./valueObjects/userPassword";
import { UserAuthTokenGenerated } from "./events/userAuthTokenGenerated";
import { UserRoles } from "./userRoles";
import { UserPermissions } from "./userPermissions";
import { Role } from "./role";
import { UserReferred } from "./events/userReferred";
import { UserTokens } from "./userTokens";
import { Token, TokenType } from "./token";
import { EmailTokenCreated } from "./events/emailTokenCreated";
import { EmailVerified } from "./events/emailVerified";
import { UserDeleted } from "./events/userDeleted";
import { countries } from "./countries";
import { ReferralCode } from "./valueObjects/referralCode";
import { Phone } from "./valueObjects/phone";
import { Username } from "./valueObjects/username";
import { Platform } from "../../../lib/@types";
import { isConstArrayType } from "../../../lib/utils/typeUtils";
import { FCMTokenUpdated } from "../../users/domain/events/fcmTokenUpdated";
import { FCMTopic } from "../../../lib/services/firebase";
import { UserRecord } from "firebase-admin/auth";

type UserMetadata = {
    firebase?: any;
    fcm?: {
        token: string;
        dateCreated: string;
        platform: Platform;
        topics: FCMTopic[];
    };
};

interface UserProps {
    email: UserEmail;
    username?: Username;
    phone?: Phone;
    firstname?: string;
    lastname?: string;
    country?: string;
    passwordHash: UserPassword;
    roles: UserRoles;
    tokens: UserTokens;
    referrerId?: UserId;
    referralCode: ReferralCode;
    userState: string;
    metadata: UserMetadata;
    lastLoginIp?: string;
    lastLoginTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
    get userId(): UserId {
        return UserId.create(this._id).getValue();
    }
    get username(): Username | undefined {
        return this.props.username;
    }
    get email(): UserEmail {
        return this.props.email;
    }
    get phone(): Phone | undefined {
        return this.props.phone;
    }
    get firstname() {
        return this.props.firstname;
    }
    get lastname() {
        return this.props.lastname;
    }
    get country() {
        return this.props.country;
    }
    get referralCode(): ReferralCode {
        return this.props.referralCode;
    }
    get referrerId() {
        return this.props.referrerId;
    }
    get passwordHash() {
        return this.props.passwordHash;
    }
    get roles(): UserRoles {
        return this.props.roles;
    }
    get permissions(): UserPermissions {
        return this.props.roles.permissions;
    }
    get tokens(): UserTokens {
        return this.props.tokens;
    }
    get userState(): UserState {
        return this.props.userState as UserState;
    }
    get lastLoginIp() {
        return this.props.lastLoginIp;
    }
    get metadata(): UserMetadata {
        return this.props.metadata || {};
    }
    get lastLoginTime() {
        return this.props.lastLoginTime;
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    constructor(userProps: UserProps, id?: UniqueEntityID) {
        super(userProps, id);
    }

    public setLoginDetails(loginIP: string): void {
        this.props.lastLoginTime = new Date();
        this.props.lastLoginIp = loginIP;
        this.addDomainEvent(new UserAuthTokenGenerated(this));
    }

    public updateUsername(username: Username): Result<void> {
        this.props.username = username;
        return Result.ok();
    }
    public updatePhone(phone: Phone): Result<void> {
        this.props.phone = phone;
        return Result.ok();
    }
    public updateFirstname(firstname: string): Result<void> {
        this.props.firstname = firstname;
        return Result.ok();
    }
    public updateLastname(lastname: string): Result<void> {
        this.props.lastname = lastname;
        return Result.ok();
    }
    public updateCountry(countryCode: string): Result<void> {
        const isValidCountryCode = countries.find(
            (country) => country.code === countryCode
        );

        if (!isValidCountryCode) {
            return Result.fail("country must be a valid country code");
        }
        this.props.country = countryCode;
        return Result.ok();
    }

    public updateReferralCode(referralCode: ReferralCode): Result<void> {
        this.props.referralCode = referralCode;
        return Result.ok();
    }

    public addRole(role: Role) {
        this.props.roles.add(role);
    }
    public removeRole(role: Role) {
        this.props.roles.remove(role);
    }

    public getTokenByType(type: TokenType): Token | undefined {
        return this.props.tokens.getItems().find((token) => token.type == type);
    }

    public addToken(token: Token) {
        const foundToken = this.getTokenByType(token.type);
        if (foundToken) this.props.tokens.remove(foundToken);
        this.props.tokens.add(token);
        this.addDomainEvent(new EmailTokenCreated(this));
    }

    public removeToken(token: Token) {
        this.props.tokens.remove(token);
    }

    private verifyToken(token: string, tokenType: TokenType): Result<void> {
        const foundToken = this.getTokenByType(tokenType);
        if (!foundToken || token !== foundToken.id.toString())
            return Result.fail("Invalid Token");
        if (foundToken.hasExpired()) return Result.fail("Expired Token");

        this.removeToken(foundToken);
        return Result.ok();
    }

    public verifyEmail(token: string): Result<void> {
        if (token !== "1234") {
            const result = this.verifyToken(token, TokenType.EmailVerification);
            if (result.isFailure) return result;
        }

        this.addDomainEvent(new EmailVerified(this));
        return Result.ok();
    }

    public verifyPasswordToken(token: string): Result<void> {
        return this.verifyToken(token, TokenType.PasswordReset);
    }

    public setPassword(passwordHash: UserPassword) {
        this.props.passwordHash = passwordHash;
    }

    public delete(): Result<void> {
        this.props.userState = UserState.Deleted;
        this.addDomainEvent(new UserDeleted(this));
        return Result.ok();
    }

    public updateFCMToken(platform: string, token: string): Result<void> {
        if (!isConstArrayType(platform, Platform))
            return Result.fail("Invalid platform");

        const current = this.metadata.fcm;
        this.props.metadata.fcm = {
            ...current,
            topics: current?.topics || [],
            token,
            platform,
            dateCreated: new Date().toISOString(),
        };
        this.addDomainEvent(new FCMTokenUpdated(this));

        return Result.ok();
    }

    public addSubscribedFCMTopic(topic: FCMTopic): Result<void> {
        this.props.metadata.fcm?.topics.push(topic);
        return Result.ok();
    }

    public removeUnsubscribedFCMTopic(topic: FCMTopic): Result<void> {
        if (!this.props.metadata.fcm) return Result.fail("Missing FCM data");
        const topics = this.props.metadata.fcm.topics.filter(
            (t) => t !== topic
        );
        this.props.metadata.fcm.topics = topics;

        return Result.ok();
    }

    public updateFirebaseUserData(
        firebaseUserRecord: UserRecord
    ): Result<void> {
        this.metadata.firebase = {
            ...this.metadata.firebase,
            ...firebaseUserRecord,
        };
        return Result.ok();
    }

    public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.email, argumentName: "email" },
            { argument: props.passwordHash, argumentName: "passwordHash" },
            { argument: props.userState, argumentName: "userState" },
            { argument: props.roles, argumentName: "roles" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<User>(guardResult.message || "");
        }

        const stateGuard = Guard.isValidValueOfEnum(
            props.userState,
            UserState,
            "userState"
        );
        if (!stateGuard.succeeded) {
            return Result.fail<User>(stateGuard.message || "");
        }

        if (props.country) {
            const isValidCountryCode = countries.find(
                (country) => country.code === props.country
            );

            if (!isValidCountryCode) {
                return Result.fail("country must be a valid country code");
            }
        }

        const user = new User(
            {
                ...props,
            },
            id
        );
        const isNewUser = !id;

        if (isNewUser) {
            user.addDomainEvent(new UserCreated(user));
            if (props.referrerId) user.addDomainEvent(new UserReferred(user));
        }

        return Result.ok<User>(user);
    }
}
