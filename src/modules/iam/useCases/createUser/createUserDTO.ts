import { RequestUserDTO } from "../../../../lib/utils/permissions";
import { IAMPermission } from "../../domain/iam.permissions";

export interface CreateUserDTO {
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
    referralCode?: string;
    role: string;
    country?: any;
    requestUser: RequestUserDTO;
    sendVerificationMail: boolean;
    sendPasswordResetMail: boolean;
}

export const defaultRequestUser: RequestUserDTO = {
    userId: "me",
    roles: ["me"],
    state: "active",
    permissions: [IAMPermission.Me],
};
