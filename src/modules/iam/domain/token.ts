import dayjs from "dayjs";
import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { Entity } from "../../../lib/domain/Entity";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { UserId } from "./userId";

export const TokenType = {
    EmailVerification: "email_verify",
    PasswordReset: "password_reset",
} as const;
export type TokenType = typeof TokenType[keyof typeof TokenType];

interface TokenProps {
    type: string;
    expiresAt?: Date;
    userId: UserId;
}

export class Token extends Entity<TokenProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get userId(): UserId {
        return this.props.userId;
    }

    get type(): TokenType {
        return this.props.type as TokenType;
    }

    get expiresAt(): Date {
        if (!this.props.expiresAt) throw new Error("Invalid expireAt");
        return this.props.expiresAt;
    }

    public hasExpired(): boolean {
        return this.expiresAt < new Date();
    }

    private constructor(props: TokenProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: TokenProps,
        id?: UniqueEntityID
    ): Result<Token> {
        const guardResult = Guard.againstNullOrUndefined(props.type, "type");
        if (!guardResult.succeeded) {
            return Result.fail<Token>(guardResult.message || "");
        }

        if (!props.expiresAt) props.expiresAt = dayjs().add(2, "days").toDate();

        return Result.ok<Token>(new Token(props, id));
    }
}
