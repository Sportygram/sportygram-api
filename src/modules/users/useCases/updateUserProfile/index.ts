import { userReadRepo, userRepo } from "../../../iam/repos";
import { streamService } from "../../../messaging/services/getStream";
import { userProfileRepo } from "../../repos";
import { UpdateUserProfile } from "./updateUserProfile";
import { UpdateUserProfileController } from "./updateUserProfileController";
import { UpdateProfileImageController } from "./uploadProfileImageController";

const updateUserProfile = new UpdateUserProfile(
    userRepo,
    userProfileRepo,
    userReadRepo,
    streamService
);

const updateUserProfileController = new UpdateUserProfileController(
    updateUserProfile
);
const updateProfileImageController = new UpdateProfileImageController(
    updateUserProfile
);

export {
    updateUserProfile,
    updateUserProfileController,
    updateProfileImageController,
};
