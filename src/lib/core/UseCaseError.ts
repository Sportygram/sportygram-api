interface IUseCasError {
    message: string;
}

export abstract class UseCaseError implements IUseCasError {
    constructor(public readonly message: string) {}
}
