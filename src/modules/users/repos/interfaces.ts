import { UserProfile } from "../domain/userProfile";

export interface UserProfileRepo {
    getUserProfileByUserId(userId: string): Promise<UserProfile | undefined>;
    save(userProfile: UserProfile): Promise<void>;
}
