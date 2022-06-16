import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase, WithChanges } from "../../../../lib/core/UseCase";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { QueryRoom, RoomReadRepo, RoomRepo } from "../../repos/interfaces";
import { GetStreamService } from "../../../messaging/services/getStream/getStreamService";
import { UpdateRoomDTO } from "./updateRoomDTO";
import { RoomDoesNotExistError } from "./updateRoomErrors";
import { MessagingPermission as P } from "../../domain/messaging.permissions";

type Response = Either<
    | RoomDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<QueryRoom>
>;

export class UpdateRoom
    extends WithChanges
    implements UseCase<UpdateRoomDTO, Promise<Response>>
{
    constructor(
        private roomRepo: RoomRepo,
        private roomReadRepo: RoomReadRepo,
        private streamService: GetStreamService
    ) {
        super();
    }

    @hasPermissions("UpdateRoom", [P.Me, P.System, P.EditRoom])
    async execute(request: UpdateRoomDTO): Promise<Response> {
        const changes: Result<any>[] = [];
        const {
            roomId,
            name,
            description,

            roomImageUrl,
        } = request;

        try {
            // Check requestUser permissions
            // Only room moderators and admin can upload
            const room = await this.roomRepo.getRoomById(roomId);
            if (!room) {
                return left(new RoomDoesNotExistError(roomId));
            }

            if (name) {
                this.addChange(room.updateName(name), changes);
            }
            if (description) {
                this.addChange(room.updateDescription(description), changes);
            }
            if (roomImageUrl) {
                this.addChange(room.updateRoomImageUrl(roomImageUrl), changes);
            }

            const updateOrError = this.getChangesResult(changes);
            if (updateOrError.isFailure) {
                return left(new AppError.InputError(updateOrError.error));
            }

            await this.streamService.updateChannel(roomId, {
                name: room.name,
                description: room.description,
                roomImageUrl: room.roomImageUrl,
            });
            await this.roomRepo.save(room);

            const readRoom = await this.roomReadRepo.getRoomById(roomId);

            if (!readRoom) throw new Error("room could not be fetched");
            return right(Result.ok<QueryRoom>(readRoom));
        } catch (err) {
            return left(
                new AppError.UnexpectedError(
                    err,
                    this.constructor.name,
                    request
                )
            );
        }
    }
}
