import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface ResetPasswordDTO {
    userId: string;
    token: string;
    password: string;
    requestUser: RequestUserDTO;
}
