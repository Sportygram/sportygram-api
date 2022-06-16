import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Result } from "../../../lib/core/Result";
import { Entity } from "../../../lib/domain/Entity";

export class LeagueId extends Entity<any> {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(null, id);
    }

    public static create(id?: UniqueEntityID): Result<LeagueId> {
        return Result.ok<LeagueId>(new LeagueId(id));
    }
}
