import logger from "./Logger";
import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";

export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: any, useCase: string, data: any) {
        super(false, {
            message: "An unexpected error occured.",
            error: err,
        } as UseCaseError);
        logger.error(`AppError`, {
            useCase,
            err,
            data,
        });
    }
}
export class PermissionsError extends Result<UseCaseError> {
    public constructor(
        useCase: string,
        userId: string,
        forOrganization?: string
    ) {
        super(false, {
            message: `You do not have authorization for ${useCase}`,
        } as UseCaseError);
        logger.error(`PermissionError`, {
            data: {
                useCase,
                userId,
                forOrganization,
            },
        });
    }
}

export class InputError extends Result<UseCaseError> {
    public constructor(err: any) {
        super(false, {
            message: `${err}`,
            error: err,
        } as UseCaseError);
        logger.error(`InputError`, { err });
    }
}
