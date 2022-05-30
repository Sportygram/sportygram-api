import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface CreateRoleDTO {
    name: string;
    description: string;
    requestUser: RequestUserDTO;
}
