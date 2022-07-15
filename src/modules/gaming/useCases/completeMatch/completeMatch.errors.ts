import { Result } from "../../../../lib/core/Result";
import { UseCaseError } from "../../../../lib/core/UseCaseError";

export class CompleteMatchError extends Result<UseCaseError> {
    constructor(errors: any) {
        super(false, {
            message: `CompleteMatchError ${JSON.stringify(errors)}`,
        } as UseCaseError);
    }
}
