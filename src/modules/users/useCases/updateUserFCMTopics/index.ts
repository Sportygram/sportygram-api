import { firebaseService } from "../../../../lib/services/firebase";
import { userRepo } from "../../../iam/repos";
import { UpdateUserFCMTopics } from "./updateUserFCMTopics";

export const updateUserFCMTopics = new UpdateUserFCMTopics(
    userRepo,
    firebaseService
);
