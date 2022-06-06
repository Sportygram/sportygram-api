import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UpdateRoomDTO {
    roomId: string;
    name?: string;
    description?: string;
    roomImageUrl?: string;
    requestUser: RequestUserDTO;
}
