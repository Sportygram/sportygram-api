import { nil, isNil } from "./Nil";

export class Maybe<T> {
    private wrappedValue: T | nil;

    constructor(value: T | nil) {
        this.wrappedValue = value;
    }

    public map<U>(fn: (x: T) => U): Maybe<U> {
        if (!isNil(this.wrappedValue)) {
            return new Maybe(fn(this.wrappedValue));
        } else {
            return new Maybe<U>(undefined);
        }
    }

    public value(): T | nil {
        return this.wrappedValue;
    }

    public valueOr<U>(backupValue: U): T | U {
        if (!isNil(this.wrappedValue)) {
            return this.wrappedValue;
        } else {
            return backupValue;
        }
    }
}
