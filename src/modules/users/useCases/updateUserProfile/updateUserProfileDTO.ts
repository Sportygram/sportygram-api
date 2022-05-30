import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UpdateUserProfileDTO {
    userId: string;
    onboarded?: boolean;
    username?: string;
    favoriteTeam?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    country?: string;
    profileImageUrl?: string;
    requestUser: RequestUserDTO;
}
