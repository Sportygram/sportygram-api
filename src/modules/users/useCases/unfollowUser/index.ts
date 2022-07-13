import { followerRepo, userProfileRepo } from "../../repos";
import { UnfollowUser } from "./unfollowUser";

export const unfollowUser = new UnfollowUser(followerRepo, userProfileRepo);
