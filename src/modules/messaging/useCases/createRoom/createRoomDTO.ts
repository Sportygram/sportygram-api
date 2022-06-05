import { UserId } from "aws-sdk/clients/appstream"
import { RequestUserDTO } from "../../../../lib/utils/permissions"

export interface CreateRoomDTO {
    name: string
    description?: string
    roomType: string
    createdBy: UserId
    requestUser: RequestUserDTO
}