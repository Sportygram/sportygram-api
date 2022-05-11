import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Result } from "../../../lib/core/Result";
import { Entity } from "../../../lib/domain/Entity";

export class PermissionId extends Entity<any> {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(null, id);
    }

    public static create(id?: UniqueEntityID): Result<PermissionId> {
        return Result.ok<PermissionId>(new PermissionId(id));
    }
}
