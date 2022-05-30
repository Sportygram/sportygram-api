import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface AssignRoleToUserDTO {
    userId: string;
    roleName: string;
    requestUser: RequestUserDTO;
}
