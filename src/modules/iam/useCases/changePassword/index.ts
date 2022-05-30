import { userRepo } from "../../repos";
import { authService } from "../../services";
import { ChangePassword } from "./changePassword";
import { ChangePasswordController } from "./changePasswordController";

const changePassword = new ChangePassword(userRepo, authService);
const changePasswordController = new ChangePasswordController(changePassword);

export { changePasswordController, changePassword };
