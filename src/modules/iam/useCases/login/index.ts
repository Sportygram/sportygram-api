import { LoginController } from "./loginController";
import { LoginUseCase } from "./login";
import { userRepo } from "../../repos/";
import { authService } from "../../services";

const loginUseCase = new LoginUseCase(userRepo, authService);

const loginController = new LoginController(loginUseCase);

export { loginController, loginUseCase };
