import { ValueObject } from "../../../../lib/domain/ValueObject";
import { Guard } from "../../../../lib/core/Guard";
import { Result } from "../../../../lib/core/Result";

export interface UsernameProps {
    value: string;
}
const invalidUsernameSubstrings = [
    "bot",
    "admin",
    "huddle",
    "null",
    "undefined",
];
export class Username extends ValueObject<UsernameProps> {
    public static minLength = 6;

    get value(): string {
        return this.props.value;
    }

    private constructor(props: UsernameProps) {
        super(props);
    }

    private static isValidUsername(username: string): boolean {
        /*
            username is 3-20 characters long
            only alphanumeric characters and underscore allowed
        */
        const re = /^(?=.{3,20}$)[a-zA-Z0-9_]+$/;
        const invalidStringsRe = new RegExp(invalidUsernameSubstrings.join("|"))
        const containInvalidString = invalidStringsRe.test(username);
        return !containInvalidString && re.test(username);
    }

    public static create(username: string): Result<Username> {
        const propsResult = Guard.againstNullOrUndefined(username, "username");

        if (!propsResult.succeeded && propsResult.message) {
            return Result.fail<Username>(propsResult.message);
        }
        const trimmedUsername = username.trim().toLowerCase();
        if (!this.isValidUsername(trimmedUsername)) {
            return Result.fail<Username>(
                "Username is invalid, username must be 3-20 characters and can only be made up of alphanumeric characters and underscore"
            );
        }

        return Result.ok<Username>(
            new Username({
                value: trimmedUsername,
            })
        );
    }
}
