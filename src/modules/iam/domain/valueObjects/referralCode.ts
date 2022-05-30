import { Result } from "../../../../lib/core/Result";
import { ValueObject } from "../../../../lib/domain/ValueObject";
import randtoken from "rand-token";

export interface ReferralCodeProps {
    value: string;
}

export class ReferralCode extends ValueObject<ReferralCodeProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: ReferralCodeProps) {
        super(props);
    }

    private static isValidReferralCode(code: string) {
        return code.length <= 20;
    }

    public static create(referralCode?: string): Result<ReferralCode> {
        if (referralCode) {
            const trimmedReferralCode = referralCode.trim().toLowerCase();
            if (!this.isValidReferralCode(trimmedReferralCode)) {
                return Result.fail<ReferralCode>("referralCode is not valid");
            } else {
                return Result.ok<ReferralCode>(
                    new ReferralCode({ value: trimmedReferralCode })
                );
            }
        } else {
            const token = randtoken.uid(
                6,
                "23456789abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
            );
            const code = `${token.slice(0, 3)}-${token.slice(3)}`.toLowerCase();
            return Result.ok<ReferralCode>(new ReferralCode({ value: code }));
        }
    }
}
