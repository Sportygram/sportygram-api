import { userProfileRepo } from "../../repos";
import { UpdateReferralDetails } from "./updateReferralDetails";

export const updateReferralDetails = new UpdateReferralDetails(userProfileRepo);