import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface DeleteUserDTO {
    userId: string;
    password: string;
    requestUser: RequestUserDTO;
}
