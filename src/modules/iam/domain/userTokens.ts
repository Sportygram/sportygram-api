import { WatchedList } from "../../../lib/domain/WatchedList";
import { Token } from "./token";

export class UserTokens extends WatchedList<Token> {
    private constructor(initialTokens: Token[]) {
        super(initialTokens);
    }

    public compareItems(a: Token, b: Token): boolean {
        return a.equals(b);
    }

    public static create(tokens: Token[]): UserTokens {
        return new UserTokens(tokens ? tokens : []);
    }
}
