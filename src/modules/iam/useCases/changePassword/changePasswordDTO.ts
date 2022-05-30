import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface ChangePasswordDTO {
    userId: string;
    oldPassword: string;
    newPassword: string;
    requestUser: RequestUserDTO;
}
