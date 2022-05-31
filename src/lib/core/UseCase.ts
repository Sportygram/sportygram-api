import { Result } from "./Result";

export interface UseCase<IRequest, IResponse> {
    execute(request?: IRequest): Promise<IResponse> | IResponse;
}

export abstract class WithChanges {
    public addChange(result: Result<any>, changes: Result<any>[]): void {
        changes.push(result);
    }

    public getChangesResult(changes: Result<any>[]): Result<any> {
        return Result.combine(changes);
    }
}
