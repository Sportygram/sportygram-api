import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Result } from "../../../lib/core/Result";
import { Entity } from "../../../lib/domain/Entity";

export class RoomGameId extends Entity<any> {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(null, id);
    }

    public static create(id?: UniqueEntityID): Result<RoomGameId> {
        return Result.ok<RoomGameId>(new RoomGameId(id));
    }
}
