import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface AssignPermissionToRoleDTO {
    roleId: string;
    permissionValue: string;
    requestUser: RequestUserDTO;
}
