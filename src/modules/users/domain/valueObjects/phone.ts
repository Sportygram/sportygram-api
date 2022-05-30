import { Result } from "../../../../lib/core/Result";
import { ValueObject } from "../../../../lib/domain/ValueObject";
import isMobilePhone from "validator/lib/isMobilePhone";

export interface PhoneProps {
    value: string;
}

export class Phone extends ValueObject<PhoneProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: PhoneProps) {
        super(props);
    }

    private static isValidPhone(phone: string) {
        return isMobilePhone(phone);
    }

    public static create(phone: string): Result<Phone> {
        const trimmedPhone = phone.trim();
        if (!this.isValidPhone(trimmedPhone)) {
            return Result.fail<Phone>("Phone is not valid");
        } else {
            return Result.ok<Phone>(new Phone({ value: trimmedPhone }));
        }
    }
}
