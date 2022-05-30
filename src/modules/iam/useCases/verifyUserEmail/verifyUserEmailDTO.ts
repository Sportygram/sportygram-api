import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface VerifyUserEmailDTO {
    userId: string;
    token: string;
    requestUser: RequestUserDTO;
}
