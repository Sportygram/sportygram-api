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

interface UserProps {
    username?: string;
    firstname?: string;
    lastname?: string;
    country?: string;
    email: UserEmail;
    passwordHash: UserPassword;
    roles: UserRoles;
    tokens: UserTokens;
    referrerId?: UserId;
    userState: string;
    lastLoginIp?: string;
    lastLoginTime?: Date;
    createdBy?: UserId;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
    get userId(): UserId {
        return UserId.create(this._id).getValue();
    }
    get username(): string | undefined {
        return this.props.username;
    }
    get email(): UserEmail {
        return this.props.email;
    }
    get firstname(): string | undefined {
        return this.props.firstname;
    }
    get lastname(): string | undefined {
        return this.props.lastname;
    }
    get country(): string | undefined {
        return this.props.country;
    }
    get referrerId(): UserId | undefined {
        return this.props.referrerId;
    }
    get passwordHash(): UserPassword {
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
    get lastLoginIp(): string | undefined {
        return this.props.lastLoginIp;
    }
    get lastLoginTime(): Date | undefined {
        return this.props.lastLoginTime;
    }
    get createdBy(): UserId | undefined {
        return this.props.createdBy;
    }
    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }
    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    constructor(userProps: UserProps, id?: UniqueEntityID) {
        super(userProps, id);
    }

    public setLoginDetails(loginIP: string): void {
        this.props.lastLoginTime = new Date();
        this.props.lastLoginIp = loginIP;
        this.addDomainEvent(new UserAuthTokenGenerated(this));
    }

    public updateUsername(username: string): Result<void> {
        this.props.username = username;
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
    public updateCountry(country: string): Result<void> {
        this.props.country = country;
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
        const result = this.verifyToken(token, TokenType.EmailVerification);
        if (result.isFailure) return result;

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

    public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.email, argumentName: "email" },
            { argument: props.passwordHash, argumentName: "password" },
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
                const isValidCountry = countries.find(
                    (country) =>
                        country.name.toLowerCase() ===
                        props.country?.toLowerCase()
                );
                if (!isValidCountry) {
                    return Result.fail("country must be a valid country code");
                }
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
