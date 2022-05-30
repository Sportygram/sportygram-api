import { userRepo } from "../../repos";
import { ResetPassword } from "./resetPassword";
import { ResetPasswordController } from "./resetPasswordController";

const resetPassword = new ResetPassword(userRepo);
const resetPasswordController = new ResetPasswordController(resetPassword);

export { resetPasswordController, resetPassword };
