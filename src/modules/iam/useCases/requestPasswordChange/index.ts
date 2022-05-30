import { userRepo } from "../../repos";
import { RequestPasswordChange } from "./requestPasswordChange";
import { RequestPasswordChangeController } from "./requestPasswordChangeController";

const requestPasswordChange = new RequestPasswordChange(userRepo);
const requestPasswordChangeController = new RequestPasswordChangeController(
    requestPasswordChange
);

export { requestPasswordChangeController, requestPasswordChange };
