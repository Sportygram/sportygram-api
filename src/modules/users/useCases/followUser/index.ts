import { followerRepo, userProfileRepo } from "../../repos";
import { FollowUser } from "./followUser";

export const followUser = new FollowUser(followerRepo, userProfileRepo);
