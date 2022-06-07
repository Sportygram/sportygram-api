import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UpdateChatUserRoleDTO {
    userId: string;
    roomId: string;
    role: string;
    requestUser: RequestUserDTO;
}
