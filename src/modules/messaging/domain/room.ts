import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { ChatUser } from "./chatUser";
import { ChatUserId } from "./chatUserId";
import { RoomCreated } from "./events/roomCreated";
import { RoomChatUsers } from "./roomChatUsers";
import { RoomId } from "./roomId";

export type RoomType = "public" | "private";

export type RoomMetadata = {
    stream?: { data: any };
};
interface RoomProps {
    name: string;
    description?: string;
    createdById: ChatUserId;
    roomType: string;
    roomImageUrl?: string;
    joiningFee: number;
    members?: RoomChatUsers;
    metadata: RoomMetadata;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Room extends AggregateRoot<RoomProps> {
    get roomId(): RoomId {
        return RoomId.create(this._id).getValue();
    }

    get name(): string {
        return this.props.name;
    }
    get description() {
        return this.props.description;
    }
    get members() {
        return this.props.members;
    }
    get createdById() {
        return this.props.createdById;
    }
    get roomType(): RoomType {
        return this.props.roomType as RoomType;
    }
    get roomImageUrl() {
        return this.props.roomImageUrl;
    }
    get joiningFee() {
        return this.props.joiningFee;
    }
    get metadata(): RoomMetadata {
        return this.props.metadata || { stream: { data: {} } };
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    public addMember(member: ChatUser): Result<void> {
        if (!this.members)
            this.props.members = RoomChatUsers.create([])
        this.members?.add(member);
        return Result.ok()
    }

    public updateStreamData(streamData: any): Result<void> {
        const current = this.metadata.stream || { data: {} };
        this.props.metadata.stream = {
            ...current,
            data: { ...current.data, ...streamData },
        };
        return Result.ok();
    }

    private constructor(roomProps: RoomProps, id?: UniqueEntityID) {
        super(roomProps, id);
    }

    public static create(props: RoomProps, id?: UniqueEntityID): Result<Room> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: "name" },
            { argument: props.description, argumentName: "description" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Room>(guardResult.message || "");
        }

        const room = new Room({ ...props }, id);
        const isNewRoom = !id;

        if (isNewRoom) {
            room.addDomainEvent(new RoomCreated(room));
        }
        return Result.ok<Room>(room);
    }
}
