import { UserProfile } from "../domain/userProfile";

export interface UserProfileRepo {
    getUserProfileByUserId(userId: string): Promise<UserProfile | undefined>;
    save(userProfile: UserProfile): Promise<void>;
}

export interface FollowerRepo {
    followUser(userId: string, followerId: string): Promise<void>;
    unfollowUser(userId: string, followerId: string): Promise<void>;
}
