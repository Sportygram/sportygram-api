import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface RemoveUserFromRoleDTO {
    userId: string;
    roleName: string;
    requestUser: RequestUserDTO;
}
