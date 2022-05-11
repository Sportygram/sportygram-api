import {
    isConstObjectType,
    isType,
    isValidEnumValue,
} from "../utils/typeUtils";

export interface GuardResult {
    succeeded: boolean;
    message?: string;
}

export interface GuardArgument {
    argument: any;
    argumentName: string;
}

export type GuardArgumentCollection = GuardArgument[];

export class Guard {
    public static combine(guardResults: GuardResult[]): GuardResult {
        for (const result of guardResults) {
            if (result.succeeded === false) return result;
        }
        return { succeeded: true };
    }

    public static greaterThan(
        minValue: number,
        actualValue: number
    ): GuardResult {
        return actualValue > minValue
            ? { succeeded: true }
            : {
                  succeeded: true,
                  message: `Number given {${actualValue}} is not greater than {${minValue}}`,
              };
    }

    public static againstAtLeast(
        numChars: number,
        text: string,
        textName: string
    ): GuardResult {
        return text.length >= numChars
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `${textName} is not at least ${numChars} chars.`,
              };
    }

    public static againstAtMost(
        numChars: number,
        text: string,
        textName: string
    ): GuardResult {
        return text.length <= numChars
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `${textName} is greater than ${numChars} chars.`,
              };
    }

    public static againstNullOrUndefined(
        argument: any,
        argumentName: string
    ): GuardResult {
        if (argument === null || argument === undefined) {
            return {
                succeeded: false,
                message: `${argumentName} is null or undefined`,
            };
        } else {
            return { succeeded: true };
        }
    }

    public static againstNullOrUndefinedBulk(
        args: GuardArgumentCollection
    ): GuardResult {
        for (const arg of args) {
            const result = this.againstNullOrUndefined(
                arg.argument,
                arg.argumentName
            );
            if (!result.succeeded) return result;
        }

        return { succeeded: true };
    }

    public static isEqual(value: any, validValue: string): GuardResult {
        if (value === validValue) {
            return { succeeded: true };
        }
        return { succeeded: false, message: `${value} is not ${validValue}` };
    }

    public static isOneOf(
        value: any,
        validValues: any[],
        argumentName: string
    ): GuardResult {
        const isValid = validValues.includes(value);
        return isValid
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
                      validValues
                  )}. Got "${value}".`,
              };
    }

    public static isValidValueOfEnum(
        value: any,
        enumObject: any,
        argumentName: string
    ): GuardResult {
        const isValid = isValidEnumValue(value, enumObject);
        return isValid
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `${argumentName} is invalid`,
              };
    }

    public static isValidValueOfObjectType<T>(
        value: any,
        typeObject: Record<string, T>,
        argumentName: string
    ): GuardResult {
        const isValid = isConstObjectType<T>(value, typeObject);
        return isValid
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `${argumentName} is invalid`,
              };
    }

    public static isValidValueOfType<T>(
        value: T,
        typeArray: ReadonlyArray<T>,
        argumentName: string
    ): GuardResult {
        const isValid = isType<T>(value, typeArray);
        return isValid
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `${argumentName} must be one of ${typeArray}`,
              };
    }

    public static inRange(
        num: number,
        min: number,
        max: number,
        argumentName: string
    ): GuardResult {
        const isInRange = num >= min && num <= max;
        if (!isInRange) {
            return {
                succeeded: false,
                message: `${argumentName} is not within range ${min} to ${max}.`,
            };
        } else {
            return { succeeded: true };
        }
    }

    public static allInRange(
        numbers: number[],
        min: number,
        max: number,
        argumentName: string
    ): GuardResult {
        let failingResult: GuardResult | undefined;
        for (const num of numbers) {
            const numIsInRangeResult = this.inRange(
                num,
                min,
                max,
                argumentName
            );
            if (!numIsInRangeResult.succeeded)
                failingResult = numIsInRangeResult;
        }

        if (failingResult) {
            return failingResult;
        } else {
            return { succeeded: true };
        }
    }
}
