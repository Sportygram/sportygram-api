import { Token } from "../domain/token";
import { Token as RawToken } from "@prisma/client";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { UserId } from "../domain/userId";

export class TokenMap {
    public static toDomain(raw: RawToken): Token | undefined {
        const userId = UserId.create(new UniqueEntityID(raw.userId)).getValue();

        const tokenOrError = Token.create(
            {
                type: raw.type,
                expiresAt: raw.expiresAt,
                userId,
            },
            new UniqueEntityID(raw.id)
        );
        return tokenOrError.isSuccess ? tokenOrError.getValue() : undefined;
    }

    public static toPersistence(token: Token): RawToken {
        return {
            id: token.id.toString(),
            userId: token.userId.id.toString(),
            type: token.type,
            expiresAt: token.expiresAt,
            createdAt: token.createdAt,
            updatedAt: token.updatedAt,
        };
    }
}
