import { Result } from "../../../../lib/core/Result";
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
    profileColour?: string;
    profileImageUrl?: string;
    requestUser: RequestUserDTO;
    changes: Result<any>[]
}
