import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UpdateUserProfileDTO {
    userId: string;
    onboarded?: boolean;
    username?: string;
    displayName?: string;
    favoriteTeam?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    country?: string;
    profileColour?: string;
    profileImageUrl?: string;
    fcmToken?: string;
    platform?: string;
    requestUser: RequestUserDTO;
}
