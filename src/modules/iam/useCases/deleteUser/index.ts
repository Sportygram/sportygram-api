import { userRepo } from "../../repos";
import { DeleteUser } from "./deleteUser";
import { DeleteUserController } from "./deleteUserController";

export const deleteUser = new DeleteUser(userRepo);
export const deleteUserController = new DeleteUserController(deleteUser);
