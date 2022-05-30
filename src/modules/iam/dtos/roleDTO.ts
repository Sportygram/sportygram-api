import { PermissionDTO } from "./permissionDTO";

export interface RoleDTO {
    id: string;
    name: string;
    description: string;
    permissions: PermissionDTO[];
}
