import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface RemoveUserFromRoleDTO {
    userId: string;
    roleId: string;
    requestUser: RequestUserDTO;
}
