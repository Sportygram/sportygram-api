import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface CreatePermissionDTO {
    accessMode: string;
    resource: string;
    description: string;
    requestUser: RequestUserDTO;
}
