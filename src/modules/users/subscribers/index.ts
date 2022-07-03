import { updateReferralDetails } from "../useCases/updateReferralDetails";
import { updateUserFCMTopics } from "../useCases/updateUserFCMTopics";
import { AfterFCMTokenUpdated } from "./afterFCMTokenUpdated";
import { AfterUserReferred } from "./afterUserReferred";

new AfterFCMTokenUpdated(updateUserFCMTopics);
new AfterUserReferred(updateReferralDetails);
