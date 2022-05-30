import { userRepo } from "../../repos";
import { RequestEmailVerification } from "./requestEmailVerification";
import { RequestEmailVerificationController } from "./requestEmailVerificationController";

const requestEmailVerification = new RequestEmailVerification(userRepo);
const requestEmailVerificationController = new RequestEmailVerificationController(
    requestEmailVerification
);

export { requestEmailVerificationController, requestEmailVerification };
